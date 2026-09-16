"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  EllipsisIcon,
  ImagePlusIcon,
  MenuIcon,
  PlusIcon,
  SendHorizontalIcon,
  TrashIcon,
} from "@/components/sites/www-yaozhineng-com-268f6e3b/shared/icons";
import { AuthBootScreen, useAuth } from "@/lib/auth/AuthProvider";
import { chatSidebarBgSrc } from "./assets";
import { ChatSidebarBrand } from "./ChatSidebarBrand";
import { ChatToast, type ChatToastMessage } from "./ChatToast";
import { DeleteConversationDialog } from "./DeleteConversationDialog";
import { requestDeleteConversation } from "./delete-dialog-store";
import {
  FEATURE_CARDS,
  QUICK_ACTIONS,
  type MessageAttachment,
  type MockConversation,
  type MockMessage,
} from "./mock-data";
import {
  claimHomepageNewSessionId,
  clearHomepageNewSessionClaim,
  loadUserChatState,
  saveUserChatState,
} from "./session-store";
import { looksLikeOptimizationRequest } from "./workflow/mock-payload";
import {
  applyWorkflowEvent,
  createInitialWorkflowState,
  runMockWorkflow,
  type WorkflowEntry,
} from "./workflow/runMockWorkflow";
import type { WorkflowUiState } from "./workflow/types";
import { WorkflowStreamView } from "./workflow/WorkflowStreamView";

type AgentStatus = {
  state: "idle" | "running";
  label: string;
  active: number;
  maxConcurrent: number;
};

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Shared blank-session factory for homepage entry + sidebar「新建对话」. */
function createBlankConversation(
  title = "新对话",
  id = createId("session"),
): MockConversation {
  return {
    id,
    title,
    updatedAt: "刚刚",
  };
}

export function ChatPageShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, logout } = useAuth();
  const [conversations, setConversations] = useState<MockConversation[]>([]);
  const [messagesBySession, setMessagesBySession] = useState<
    Record<string, MockMessage[]>
  >({});
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sessionsReady, setSessionsReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    state: "idle",
    label: "智能体待命",
    active: 0,
    maxConcurrent: 1,
  });
  const [liveWorkflow, setLiveWorkflow] = useState<WorkflowUiState | null>(
    null,
  );
  const [liveWorkflowMessageId, setLiveWorkflowMessageId] = useState<
    string | null
  >(null);
  const [toast, setToast] = useState<ChatToastMessage | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const skipNextPersist = useRef(false);
  const workflowAbortRef = useRef<AbortController | null>(null);
  /** Ensures homepage `?new=1` only opens one blank session per mount/entry. */
  const entryNewHandledRef = useRef(false);

  useEffect(() => {
    if (ready && !user) {
      const params = new URLSearchParams({ redirect: "/chat" });
      if (searchParams.get("new") === "1") params.set("new", "1");
      router.replace(`/login?${params.toString()}`);
    }
  }, [ready, user, router, searchParams]);

  useEffect(() => {
    if (!ready || !user) {
      setSessionsReady(false);
      setConversations([]);
      setMessagesBySession({});
      setCurrentId(null);
      entryNewHandledRef.current = false;
      return;
    }

    // After `?new=1` is handled and stripped from the URL, ignore the follow-up
    // searchParams update so we do not wipe the blank session we just opened.
    if (entryNewHandledRef.current && searchParams.get("new") !== "1") {
      clearHomepageNewSessionClaim(user.username);
      return;
    }

    // Load history for the sidebar only. Do not auto-select a prior session when
    // arriving with `?new=1` (homepage CTA → login → chat).
    skipNextPersist.current = true;
    const stored = loadUserChatState(user.username);
    const forceNew = searchParams.get("new") === "1";

    if (forceNew) {
      // Claim survives StrictMode remount + effect re-entry; only the first
      // claimant actually inserts a blank conversation.
      const { id, isNew } = claimHomepageNewSessionId(user.username, () =>
        createId("session"),
      );

      let conversationsNext = stored.conversations;
      let messagesNext = stored.messagesBySession;

      if (isNew || !stored.conversations.some((item) => item.id === id)) {
        const next = createBlankConversation("新对话", id);
        conversationsNext = [
          next,
          ...stored.conversations.filter((item) => item.id !== id),
        ];
        messagesNext = {
          ...stored.messagesBySession,
          [id]: stored.messagesBySession[id] ?? [],
        };
        saveUserChatState(user.username, {
          conversations: conversationsNext,
          messagesBySession: messagesNext,
          currentId: id,
        });
      }

      setConversations(conversationsNext);
      setMessagesBySession(messagesNext);
      setCurrentId(id);
      setDraft("");
      setMobileSidebarOpen(false);
      entryNewHandledRef.current = true;
      setSessionsReady(true);
      router.replace("/chat", { scroll: false });
      return;
    }

    clearHomepageNewSessionClaim(user.username);

    // Keep history available; leave currentId null so old messages are only
    // shown after an explicit sidebar click (or「新建对话」).
    setConversations(stored.conversations);
    setMessagesBySession(stored.messagesBySession);
    setCurrentId(null);
    setSessionsReady(true);
  }, [ready, user, searchParams, router]);

  useEffect(() => {
    if (!sessionsReady || !user) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    saveUserChatState(user.username, {
      conversations,
      messagesBySession,
      currentId,
    });
  }, [sessionsReady, user, conversations, messagesBySession, currentId]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    return () => {
      workflowAbortRef.current?.abort();
    };
  }, []);

  const currentMessages = useMemo(
    () => (currentId ? messagesBySession[currentId] || [] : []),
    [currentId, messagesBySession],
  );
  const showWelcome = !currentId || currentMessages.length === 0;
  const canSend = draft.trim().length > 0 && agentStatus.state !== "running";

  const createConversation = useCallback((title = "新对话") => {
    const next = createBlankConversation(title);
    setConversations((prev) => [next, ...prev]);
    setMessagesBySession((prev) => ({ ...prev, [next.id]: [] }));
    setCurrentId(next.id);
    setDraft("");
    setMobileSidebarOpen(false);
    return next.id;
  }, []);

  const patchWorkflowMessage = useCallback(
    (sessionId: string, messageId: string, workflow: WorkflowUiState) => {
      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: (prev[sessionId] || []).map((message) =>
          message.id === messageId
            ? {
                ...message,
                kind: "workflow",
                content: workflow.summary || workflow.stageLabel,
                workflow,
              }
            : message,
        ),
      }));
    },
    [],
  );

  const runMockAgent = useCallback(
    (sessionId: string, userText: string, entry?: WorkflowEntry) => {
      workflowAbortRef.current?.abort();
      const controller = new AbortController();
      workflowAbortRef.current = controller;

      const assistantId = createId("msg");
      const initial = createInitialWorkflowState({
        sessionId,
        request: userText,
      });

      const assistantMsg: MockMessage = {
        id: assistantId,
        role: "assistant",
        kind: "workflow",
        content: initial.stageLabel,
        workflow: initial,
      };

      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), assistantMsg],
      }));
      setLiveWorkflow(initial);
      setLiveWorkflowMessageId(assistantId);
      setAgentStatus({
        state: "running",
        label: initial.stageLabel,
        active: 1,
        maxConcurrent: 1,
      });

      void runMockWorkflow({
        sessionId,
        request: userText,
        entry,
        signal: controller.signal,
        onEvent: (event) => {
          setLiveWorkflow((prev) => {
            const base =
              prev ??
              createInitialWorkflowState({ sessionId, request: userText });
            const next = applyWorkflowEvent(base, event);
            window.queueMicrotask(() => {
              patchWorkflowMessage(sessionId, assistantId, next);
              setAgentStatus({
                state: next.active ? "running" : "idle",
                label: next.stageLabel,
                active: next.active ? 1 : 0,
                maxConcurrent: 1,
              });
              if (!next.active) {
                setLiveWorkflowMessageId(null);
              }
            });
            return next;
          });
        },
      }).catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setAgentStatus({
          state: "idle",
          label: "智能体待命",
          active: 0,
          maxConcurrent: 1,
        });
      });
    },
    [patchWorkflowMessage],
  );

  const sendMessage = useCallback(
    (
      text: string,
      options?: {
        entry?: WorkflowEntry;
        attachments?: MessageAttachment[];
      },
    ) => {
      const content = text.trim();
      const attachments = options?.attachments;
      const entry = options?.entry;
      // Allow image-only upload demos; otherwise require text.
      if ((!content && !attachments?.length) || agentStatus.state === "running") {
        return;
      }

      const titleSource = content || attachments?.[0]?.name || "新对话";
      const title =
        titleSource.length > 28 ? `${titleSource.slice(0, 28)}…` : titleSource;

      const userMsg: MockMessage = {
        id: createId("msg"),
        role: "user",
        kind: "text",
        content,
        ...(attachments?.length ? { attachments } : {}),
      };

      let sessionId = currentId;
      if (!sessionId) {
        // Create session + first message in one write (quick actions must not leave empty session).
        sessionId = createId("session");
        const next: MockConversation = {
          id: sessionId,
          title,
          updatedAt: "刚刚",
        };
        setConversations((prev) => [next, ...prev]);
        setCurrentId(sessionId);
        setMobileSidebarOpen(false);
        setMessagesBySession((prev) => ({
          ...prev,
          [sessionId!]: [userMsg],
        }));
      } else {
        setConversations((prev) =>
          prev.map((item) =>
            item.id === sessionId
              ? {
                  ...item,
                  title: item.title === "新对话" ? title : item.title,
                  updatedAt: "刚刚",
                }
              : item,
          ),
        );
        setMessagesBySession((prev) => ({
          ...prev,
          [sessionId!]: [...(prev[sessionId!] || []), userMsg],
        }));
      }
      setDraft("");

      const workflowRequest =
        content ||
        (attachments?.[0]
          ? `[结构图: ${attachments[0].name}]\n请对这个分子结构进行成药性优化`
          : "");

      if (entry || looksLikeOptimizationRequest(workflowRequest)) {
        runMockAgent(sessionId!, workflowRequest, entry);
      } else {
        const reply: MockMessage = {
          id: createId("msg"),
          role: "assistant",
          kind: "text",
          content:
            "请输入含 SMILES / PDB / 成药性优化目标的请求以启动演示工作流。\n例如：SMILES: Cc1ccc(NC(=O)c2cn[nH]c2)cc1，请改善代谢稳定性并降低肝毒性风险。",
        };
        setMessagesBySession((prev) => ({
          ...prev,
          [sessionId!]: [...(prev[sessionId!] || []), reply],
        }));
      }
    },
    [agentStatus.state, currentId, runMockAgent],
  );

  const startQuickAction = useCallback(
    (action: (typeof QUICK_ACTIONS)[number]) => {
      sendMessage(action.prompt, {
        entry: action.entry,
        attachments: action.attachments
          ? action.attachments.map((file) => ({ ...file }))
          : undefined,
      });
    },
    [sendMessage],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(draft);
    }
  }

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((item) => item.id !== id));
    setMessagesBySession((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setCurrentId((current) => {
      if (current === id) {
        setDraft("");
        return null;
      }
      return current;
    });
    setToast({
      id: createId("toast"),
      title: "对话已删除",
      description: "会话记录已从侧边栏移除。",
    });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);
  const requestDelete = useCallback((id: string) => {
    // External store — ChatPageShell does not setState for dialog open.
    requestDeleteConversation(id);
  }, []);

  const toggleThinking = useCallback(() => {
    if (liveWorkflow && liveWorkflowMessageId && currentId) {
      const next = {
        ...liveWorkflow,
        thinkingOpen: !liveWorkflow.thinkingOpen,
      };
      setLiveWorkflow(next);
      patchWorkflowMessage(currentId, liveWorkflowMessageId, next);
      return;
    }
    if (!currentId) return;
    setMessagesBySession((messagesPrev) => {
      const list = messagesPrev[currentId] || [];
      const target = [...list].reverse().find((m) => m.kind === "workflow");
      if (!target?.workflow) return messagesPrev;
      return {
        ...messagesPrev,
        [currentId]: list.map((message) =>
          message.id === target.id && message.workflow
            ? {
                ...message,
                workflow: {
                  ...message.workflow,
                  thinkingOpen: !message.workflow.thinkingOpen,
                },
              }
            : message,
        ),
      };
    });
  }, [currentId, liveWorkflow, liveWorkflowMessageId, patchWorkflowMessage]);

  function resolveWorkflow(message: MockMessage): WorkflowUiState | null {
    if (
      liveWorkflow &&
      liveWorkflowMessageId &&
      message.id === liveWorkflowMessageId
    ) {
      return liveWorkflow;
    }
    return message.workflow ?? null;
  }

  if (!ready) {
    return <AuthBootScreen />;
  }

  if (!user) {
    // Redirect effect handles navigation; keep boot screen (no chat chrome flash).
    return <AuthBootScreen />;
  }

  if (!sessionsReady) {
    return <AuthBootScreen />;
  }

  const avatarLetter = (user.display_name || user.username || "U")
    .charAt(0)
    .toLowerCase();

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <ChatSidebarBrand />

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => createConversation()}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#4f6ef7] px-4 text-[14px] font-semibold text-white shadow transition-colors hover:bg-[#3f5de6] active:bg-[#2648DC]"
        >
          <PlusIcon />
          新建对话
        </button>
      </div>

      <div className="h-px w-full shrink-0 bg-[#e8ebf2]" />

      <nav
        className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 pt-4"
        aria-label="会话列表"
      >
        <div className="mb-3 flex items-center justify-between px-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7890]">
            对话列表
          </div>
          <div className="inline-flex items-center rounded-full border border-transparent bg-[#eef4ff] px-2 py-0.5 text-[11px] font-semibold text-[#4f6ef7]">
            {conversations.length}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white/60 px-4 py-8 text-center text-[13px] text-[#6e7890]">
              暂无对话记录
            </div>
          ) : (
            <div className="min-w-0 space-y-1 pb-4">
              {conversations.map((item) => {
                const active = item.id === currentId;
                return (
                  <div
                    key={item.id}
                    className={`group relative flex items-center rounded-xl transition-colors ${
                      active
                        ? "bg-[#eef1fe] text-[#2f5bff]"
                        : "hover:bg-[#f3f6fc] text-[#1a1f36]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentId(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className="min-w-0 flex-1 px-3 py-2.5 text-left"
                    >
                      <div className="truncate text-[13px] font-medium">
                        {item.title}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-[#8b93a7]">
                        {item.updatedAt}
                      </div>
                    </button>
                    <button
                      type="button"
                      title="删除对话"
                      aria-label={`删除对话 ${item.title}`}
                      onClick={() => requestDelete(item.id)}
                      className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#94a3b8] opacity-100 transition-colors hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="h-px w-full shrink-0 bg-[#e8ebf2]" />

      <nav
        ref={profileRef}
        className="relative z-10 shrink-0 bg-white/95 px-4 pb-4 pt-3 backdrop-blur-xl"
        aria-label="账户菜单"
      >
        <button
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          className="flex min-h-[70px] w-full items-center justify-between gap-3 rounded-[20px] border border-[rgba(214,226,246,0.96)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,255,0.98))] px-4 py-3.5 text-[13px] font-medium shadow-[0_14px_28px_rgba(64,88,151,0.08)] transition-colors hover:border-[#4f6ef7]/20 hover:shadow-[0_18px_32px_rgba(64,88,151,0.12)]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#4f6ef7]/20 bg-[linear-gradient(180deg,rgba(240,245,255,0.95),rgba(255,255,255,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <span className="flex h-full w-full items-center justify-center rounded-full text-[13px] font-bold text-[#4f6ef7]">
                {avatarLetter}
              </span>
            </span>
            <div className="min-w-0 flex-1 text-left leading-tight">
              <strong className="block truncate text-[14px] font-semibold text-[#1a1f36]">
                {user.display_name || user.username}
              </strong>
              <span className="mt-1 block truncate text-[12px] text-[#6e7890]">
                账号中心
              </span>
            </div>
          </div>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#6e7890] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <EllipsisIcon />
          </span>
        </button>

        {profileOpen ? (
          <div className="absolute bottom-[88px] left-4 right-4 z-20 overflow-hidden rounded-2xl border border-[#e5e8f0] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] font-semibold text-red-500 hover:bg-red-50"
              onClick={() => {
                setProfileOpen(false);
                logout();
                router.replace("/login?redirect=/chat");
              }}
            >
              退出登录
            </button>
          </div>
        ) : null}
      </nav>
    </div>
  );

  return (
    <>
    <div className="app-shell-viewport flex bg-transparent">
      <aside
        aria-label="应用侧栏"
        className="hidden w-[310px] shrink-0 border-r border-[#e5e8f0] bg-[#fbfcfe] shadow-sm lg:block"
        style={{
          backgroundImage: `url("${chatSidebarBgSrc}")`,
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
        }}
      >
        {sidebar}
      </aside>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="关闭侧栏"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-[310px] bg-[#fbfcfe] shadow-xl"
            style={{
              backgroundImage: `url("${chatSidebarBgSrc}")`,
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          >
            {sidebar}
          </aside>
        </div>
      ) : null}

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
        <div className="flex items-center gap-3 border-b border-[#e8ebf2] px-4 py-3 lg:hidden">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#5a6178]"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="打开侧栏"
          >
            <MenuIcon />
          </button>
          <strong className="text-sm font-bold text-[#1a1f36]">
            成药性优化智能体
          </strong>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 lg:px-7">
            <div className="mx-auto max-w-[1160px] min-w-0">
              {showWelcome ? (
                <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 pb-8 pt-6 text-center sm:gap-9 sm:pb-12 lg:min-h-[74vh] lg:gap-10 lg:pb-14 lg:pt-14">
                  <div className="w-full max-w-[860px]">
                    <h1 className="mb-3 text-[36px] font-bold tracking-tight text-[#1a1f36] sm:text-[42px] lg:text-[48px]">
                      成药性优化智能体
                    </h1>
                    <p className="mx-auto max-w-[820px] text-[17px] leading-8 text-[#6b7a99] sm:text-[16px] sm:leading-relaxed">
                      上传化合物结构图或输入SMILES，快速获得候选分子和成药性优化方案
                    </p>
                  </div>

                  <div className="mx-auto flex w-full max-w-full flex-wrap justify-center gap-3 sm:w-[92%] lg:w-[88%]">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => startQuickAction(action)}
                        className="inline-flex h-auto items-center justify-center rounded-full border border-[#a8c0ff] bg-white px-5 py-2.5 text-[13px] font-medium text-[#2f5bff] shadow-sm transition-colors hover:border-[#7aa0ff] hover:bg-[#f0f5ff] sm:text-[14px]"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 lg:gap-5">
                    {FEATURE_CARDS.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => {
                          sendMessage(card.prompt, {
                            entry: card.id,
                            attachments:
                              "attachments" in card
                                ? [...card.attachments]
                                : undefined,
                          });
                        }}
                        className="flex min-h-[138px] cursor-pointer flex-col justify-between rounded-[24px] border border-[#dde6f5] bg-white p-[18px] text-left shadow-[0_2px_12px_rgba(64,88,151,0.07)] transition-all hover:border-[#a8c0ff] hover:shadow-[0_4px_20px_rgba(64,88,151,0.12)] sm:min-h-[148px] sm:rounded-[26px] sm:p-5"
                        style={{
                          backgroundImage: `url("${card.background}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div>
                          <h3 className="mb-2.5 text-[18px] font-semibold text-[#1a2233]">
                            {card.title}
                          </h3>
                          <p className="text-[14px] leading-7 text-[#7d8aaa]">
                            {card.desc}
                          </p>
                        </div>
                        <span className="mt-3 block text-[12px] font-medium text-[#4a7cff]">
                          {card.footer}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex max-w-[860px] flex-col gap-4 py-4 sm:py-8">
                  {currentMessages.map((message) => {
                    if (message.role === "user") {
                      return (
                        <div key={message.id} className="flex justify-end gap-3">
                          <div className="max-w-[85%] rounded-2xl border border-[#e5e8f0] bg-white/90 px-4 py-3 text-[14px] leading-7 text-[#1a2233] shadow-sm backdrop-blur-sm">
                            <div className="mb-1 text-[12px] font-semibold text-[#6e7890]">
                              用户
                            </div>
                            {message.attachments?.length ? (
                              <div className="mb-2.5 flex flex-col gap-2">
                                {message.attachments.map((file) =>
                                  file.type === "image" ? (
                                    <figure
                                      key={`${file.name}-${file.url}`}
                                      className="overflow-hidden rounded-xl border border-[#e5e8f0] bg-[#f8fafc]"
                                    >
                                      <img
                                        src={file.url}
                                        alt={file.name}
                                        className="max-h-[220px] w-auto max-w-full object-contain"
                                      />
                                      <figcaption className="truncate border-t border-[#e5e8f0] px-2.5 py-1.5 text-[11px] text-[#6e7890]">
                                        {file.name}
                                      </figcaption>
                                    </figure>
                                  ) : null,
                                )}
                              </div>
                            ) : null}
                            {message.content ? (
                              <div className="whitespace-pre-wrap">
                                {message.content}
                              </div>
                            ) : null}
                          </div>
                          <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[12px] font-bold text-[#4f6ef7]">
                            U
                          </span>
                        </div>
                      );
                    }

                    const workflow = resolveWorkflow(message);
                    if (message.kind === "workflow" && workflow) {
                      return (
                        <WorkflowStreamView
                          key={message.id}
                          workflow={workflow}
                          onToggleThinking={toggleThinking}
                        />
                      );
                    }

                    return (
                      <div key={message.id} className="flex justify-start">
                        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl border border-[#e5e8f0] bg-white px-4 py-3 text-[14px] leading-7 text-[#1a2233] shadow-sm">
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="px-3 pt-3 sm:px-5 lg:px-7">
            <div className="mx-auto max-w-[960px]">
              {agentStatus.state === "running" ? (
                <div className="mb-2 flex items-center justify-between rounded-2xl border border-[#c7d7ff] bg-[#f3f7ff] px-4 py-2.5 text-[12px] text-[#2f5bff] sm:text-[13px]">
                  <span className="font-medium">
                    执行中 · {agentStatus.label}
                  </span>
                  <span className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-[12px] font-semibold text-[#64748b]">
                    执行中 {agentStatus.active}/{agentStatus.maxConcurrent}
                  </span>
                </div>
              ) : null}

              <form
                onSubmit={onSubmit}
                className="flex items-end gap-2 rounded-[24px] border border-[rgba(103,141,255,0.32)] bg-white px-3 py-2.5 shadow-[0_2px_16px_rgba(64,88,151,0.08)] transition-all focus-within:border-[rgba(78,124,255,0.65)] focus-within:shadow-[0_2px_20px_rgba(64,88,151,0.14)] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3"
              >
                <button
                  type="button"
                  title="上传分子图像或靶点 PDB 文件"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[#8fa3c8] transition-colors hover:bg-[#f0f5ff] hover:text-[#4a7cff] sm:h-8 sm:w-8 sm:rounded-xl"
                >
                  <ImagePlusIcon />
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="上传分子图像或靶点 PDB，输入 SMILES / 靶点 ID，或直接描述需求"
                  className="max-h-[200px] min-h-0 flex-1 resize-none border-0 bg-transparent p-0 py-1 text-[14px] leading-6 text-[#1a2233] shadow-none outline-none placeholder:text-[#a0aec4] sm:text-[15px] sm:leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#2f5bff] text-white shadow-[0_2px_8px_rgba(47,91,255,0.32)] transition-colors hover:bg-[#1f4bef] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none sm:h-8 sm:w-8 sm:rounded-xl"
                >
                  <SendHorizontalIcon />
                </button>
              </form>
            </div>
          </div>

          <div className="px-3 pb-2 text-center sm:px-5 sm:pb-2.5 lg:px-7 lg:pb-3">
            <div className="mx-auto max-w-[960px]">
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-normal text-[#5f76b3] transition-colors hover:text-[#2f5bff] sm:text-xs"
              >
                粤ICP备2026026873号-2
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
    <DeleteConversationDialog onConfirm={deleteConversation} />
    <ChatToast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
