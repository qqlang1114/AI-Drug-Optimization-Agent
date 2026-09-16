import {
  getPayloadForEntry,
  resolveWorkflowEntry,
  type WorkflowEntry,
} from "../mock-payload";
import type {
  LlmIntentRequest,
  LlmIntentResponse,
  LlmRouteRequest,
  LlmRouteResponse,
  LlmService,
  ServiceCallOptions,
} from "./types";

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => resolve(), ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

const INTENT_LABELS: Record<WorkflowEntry, string> = {
  upload: "结构图成药性综合优化",
  smiles: "SMILES 单项成药性优化",
  target: "靶点亲和力与 ADMET 多目标优化",
};

/**
 * Mock LLM — returns canned intent / routes from mock-payload.
 *
 * REAL HOOK:
 *   replace body with `fetch("/api/llm/...", { method: "POST", body: JSON.stringify(request) })`
 *   or an SDK call to your chat / chemistry LLM endpoint.
 */
export function createMockLlmService(): LlmService {
  return {
    async parseIntent(
      request: LlmIntentRequest,
      options?: ServiceCallOptions,
    ): Promise<LlmIntentResponse> {
      await delay(120, options?.signal);
      const entry =
        request.hintEntry ||
        resolveWorkflowEntry(request.userText) ||
        ("smiles" as const);

      return {
        entry,
        intentLabel: INTENT_LABELS[entry],
        thinkingSteps: [
          `正在识别用户意图：${INTENT_LABELS[entry]}...`,
          "正在整合用户需求和分子信息",
        ],
        optimizationGoals:
          entry === "upload"
            ? ["吸收", "代谢", "毒性"]
            : entry === "target"
              ? ["亲和力", "肝损伤风险", "代谢稳定性"]
              : ["代谢稳定性", "肝损伤风险"],
      };
    },

    async generateRoutes(
      request: LlmRouteRequest,
      options?: ServiceCallOptions,
    ): Promise<LlmRouteResponse> {
      await delay(180, options?.signal);
      // REAL: stream tokens; map tool-calls into OptimizationRoute[].
      const payload = getPayloadForEntry(request.entry);
      return {
        routes: [...payload.routes],
        summary: payload.summary,
      };
    },
  };
}
