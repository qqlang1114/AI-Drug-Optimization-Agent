import {
  extractPdbId,
  extractSmiles,
  type WorkflowEntry,
} from "./mock-payload";
import {
  createMockDrugAgentServices,
  type DrugAgentServices,
} from "./services";
import type { WorkflowEvent, WorkflowUiState } from "./types";

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createInitialWorkflowState(args: {
  sessionId: string;
  request: string;
}): WorkflowUiState {
  return {
    taskId: createId("task"),
    sessionId: args.sessionId,
    request: args.request,
    active: true,
    stage: "intake",
    stageLabel: "正在分析请求",
    queueAhead: 0,
    elapsedSec: 0,
    thinkingOpen: true,
    showIntake: true,
    showPhaseDock: false,
    steps: [],
    similar: [],
    inputMolecule: null,
    literature: [],
    routes: [],
    candidates: [],
    counts: { similar: 0, routes: 0, candidates: 0 },
  };
}

export function applyWorkflowEvent(
  state: WorkflowUiState,
  event: WorkflowEvent,
): WorkflowUiState {
  switch (event.type) {
    case "stage":
      return {
        ...state,
        stage: event.stage,
        stageLabel: event.label,
      };
    case "step_add":
      return { ...state, steps: [...state.steps, event.step] };
    case "step_done":
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === event.stepId ? { ...step, done: true } : step,
        ),
      };
    case "intake":
      return {
        ...state,
        showIntake: event.visible,
        queueAhead: event.queueAhead,
      };
    case "phase_dock":
      return { ...state, showPhaseDock: event.visible };
    case "similar":
      return {
        ...state,
        similar: event.items,
        counts: { ...state.counts, similar: event.items.length },
      };
    case "input_molecule":
      return { ...state, inputMolecule: event.molecule };
    case "literature":
      return { ...state, literature: event.items };
    case "routes":
      return {
        ...state,
        routes: event.items,
        counts: { ...state.counts, routes: event.items.length },
      };
    case "candidates":
      return {
        ...state,
        candidates: event.items,
        counts: { ...state.counts, candidates: event.items.length },
      };
    case "counts":
      return { ...state, counts: { ...state.counts, ...event.counts } };
    case "summary":
      return { ...state, summary: event.text };
    case "tick":
      return { ...state, elapsedSec: event.elapsedSec };
    case "done":
      return {
        ...state,
        active: false,
        stage: "done",
        stageLabel: "工作流已完成",
        showIntake: false,
        showPhaseDock: false,
        thinkingOpen: false,
        steps: state.steps.map((step) => ({ ...step, done: true })),
      };
    case "error":
      return {
        ...state,
        active: false,
        stage: "error",
        stageLabel: event.message,
        showPhaseDock: false,
      };
    default:
      return state;
  }
}

type RunOptions = {
  sessionId: string;
  request: string;
  onEvent: (event: WorkflowEvent) => void;
  signal?: AbortSignal;
  /** Optional explicit entry from feature card click */
  entry?: WorkflowEntry;
  /**
   * Injectable service bundle.
   * REAL: pass createDrugAgentServices({ llm: httpLlm, ... }) from app bootstrap.
   */
  services?: DrugAgentServices;
};

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => resolve(), ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function emitStep(
  onEvent: (event: WorkflowEvent) => void,
  text: string,
  dwellMs: number,
  signal?: AbortSignal,
) {
  const id = createId("step");
  onEvent({ type: "step_add", step: { id, text, done: false } });
  await wait(dwellMs, signal);
  onEvent({ type: "step_done", stepId: id });
}

async function runSharedIntake(
  onEvent: (event: WorkflowEvent) => void,
  signal?: AbortSignal,
) {
  onEvent({ type: "stage", stage: "intake", label: "正在分析请求" });
  onEvent({ type: "intake", visible: true, queueAhead: 0 });
  await wait(1000, signal);
  onEvent({ type: "intake", visible: false, queueAhead: 0 });
  onEvent({ type: "phase_dock", visible: true });
  onEvent({ type: "stage", stage: "intent", label: "深度思考与分析中..." });
  await emitStep(onEvent, "任务开始执行…", 450, signal);
}

function callOpts(signal?: AbortSignal) {
  return { signal };
}

/** Upload structure → parse → ADMET → knowledge → LLM routes */
async function runUploadPath(
  services: DrugAgentServices,
  request: string,
  intentLabel: string,
  onEvent: (event: WorkflowEvent) => void,
  signal?: AbortSignal,
) {
  await emitStep(
    onEvent,
    `🚦 正在识别用户意图：${intentLabel}...`,
    800,
    signal,
  );

  const imageMatch = request.match(/\[结构图:\s*([^\]]+)\]/);
  const imageRef = imageMatch?.[1]?.trim() || "example-molecule.png";

  onEvent({ type: "stage", stage: "intent", label: "正在识别分子结构图..." });
  await emitStep(onEvent, `🖼️ 正在识别上传结构图 (${imageRef})...`, 1000, signal);
  // REAL: moleculeParsing.parseFromImage → OCSR model
  const parsed = await services.moleculeParsing.parseFromImage(
    { imageRef, userText: request },
    callOpts(signal),
  );
  await emitStep(onEvent, "🔎 正在解析分子拓扑与原子连通性...", 900, signal);

  onEvent({ type: "stage", stage: "admet", label: "正在进行ADMET性质预测" });
  await emitStep(onEvent, "🔧正在进行ADMET多维度综合预测...", 1100, signal);
  // REAL: admet.predict → QSAR / ADMET-AI endpoint
  const admet = await services.admet.predict(
    {
      smiles: parsed.smiles,
      mode: "upload",
      label: parsed.label,
    },
    callOpts(signal),
  );
  onEvent({ type: "input_molecule", molecule: admet.molecule });

  onEvent({ type: "stage", stage: "similar", label: "正在搜索相似分子" });
  await emitStep(onEvent, "🧬 正在搜索相似分子...", 900, signal);
  const similar = await services.knowledge.searchSimilar(
    { smiles: parsed.smiles, entry: "upload" },
    callOpts(signal),
  );
  onEvent({ type: "similar", items: similar.items });

  onEvent({ type: "stage", stage: "literature", label: "正在检索文献知识库" });
  await emitStep(onEvent, "📚 正在检索文献知识库...", 800, signal);
  const literature = await services.knowledge.searchLiterature(
    { query: request, entry: "upload", smiles: parsed.smiles },
    callOpts(signal),
  );
  onEvent({ type: "literature", items: literature.items });

  onEvent({ type: "stage", stage: "routes", label: "正在生成优化路线" });
  await emitStep(onEvent, "🧪 正在生成综合成药性优化路线...", 1100, signal);
  // REAL: llm.generateRoutes → chemistry LLM / planner
  const routes = await services.llm.generateRoutes(
    {
      entry: "upload",
      userText: request,
      smiles: parsed.smiles,
      similarCount: similar.items.length,
    },
    callOpts(signal),
  );
  onEvent({ type: "routes", items: routes.routes });

  const candidates = await services.docking.generateCandidates(
    {
      pdbId: "n/a",
      seedSmiles: parsed.smiles,
      entry: "upload",
    },
    callOpts(signal),
  );
  onEvent({ type: "candidates", items: candidates.candidates });

  return routes.summary;
}

/** SMILES single-property optimization path */
async function runSmilesPath(
  services: DrugAgentServices,
  request: string,
  intentLabel: string,
  onEvent: (event: WorkflowEvent) => void,
  signal?: AbortSignal,
) {
  await emitStep(
    onEvent,
    `🚦 正在识别用户意图：${intentLabel}...`,
    800,
    signal,
  );

  const smilesHint = extractSmiles(request) || "";
  const parsed = await services.moleculeParsing.parseFromSmiles(
    { smiles: smilesHint },
    callOpts(signal),
  );
  const smiles = smilesHint || parsed.smiles;

  onEvent({ type: "stage", stage: "admet", label: "正在进行ADMET性质预测" });
  await emitStep(onEvent, "🔧正在进行ADMET性质预测...", 1000, signal);
  await emitStep(onEvent, "✅ 正在整合用户需求和分子信息", 650, signal);
  await emitStep(
    onEvent,
    `⏳ [${smiles}] 正在排队等待优化资源...`,
    700,
    signal,
  );

  const admet = await services.admet.predict(
    { smiles, mode: "smiles", label: parsed.label },
    callOpts(signal),
  );
  onEvent({ type: "input_molecule", molecule: admet.molecule });

  onEvent({ type: "stage", stage: "similar", label: "正在搜索相似分子" });
  await emitStep(onEvent, "🧪 正在进行分子优化 (查询知识库)...", 650, signal);
  await emitStep(onEvent, "🧬 正在搜索相似分子...", 900, signal);
  const similar = await services.knowledge.searchSimilar(
    { smiles, entry: "smiles" },
    callOpts(signal),
  );
  onEvent({ type: "similar", items: similar.items });

  onEvent({ type: "stage", stage: "literature", label: "正在检索文献知识库" });
  await emitStep(onEvent, "📚 正在检索文献知识库...", 900, signal);
  const literature = await services.knowledge.searchLiterature(
    { query: request, entry: "smiles", smiles },
    callOpts(signal),
  );
  onEvent({ type: "literature", items: literature.items });
  await emitStep(onEvent, "✅ 知识库检索完成，准备生成路线", 500, signal);

  onEvent({ type: "stage", stage: "routes", label: "正在生成优化路线" });
  await emitStep(
    onEvent,
    "🧪 正在生成代谢稳定性 / 肝毒性专项优化路线...",
    1100,
    signal,
  );
  const routes = await services.llm.generateRoutes(
    {
      entry: "smiles",
      userText: request,
      smiles,
      similarCount: similar.items.length,
    },
    callOpts(signal),
  );
  onEvent({ type: "routes", items: routes.routes });

  const candidates = await services.docking.generateCandidates(
    { pdbId: "n/a", seedSmiles: smiles, entry: "smiles" },
    callOpts(signal),
  );
  onEvent({ type: "candidates", items: candidates.candidates });

  return routes.summary;
}

/** Target PDB affinity + ADMET multi-objective path */
async function runTargetPath(
  services: DrugAgentServices,
  request: string,
  intentLabel: string,
  onEvent: (event: WorkflowEvent) => void,
  signal?: AbortSignal,
) {
  await emitStep(
    onEvent,
    `🚦 正在识别用户意图：${intentLabel}...`,
    800,
    signal,
  );

  const pdbHint = extractPdbId(request) || "8fln";
  onEvent({ type: "stage", stage: "intent", label: "正在解析靶点结构..." });
  await emitStep(onEvent, `🧬 正在解析靶点结构 PDB ${pdbHint}...`, 1000, signal);
  // REAL: moleculeParsing.parseTarget → PDB + pocket service
  const target = await services.moleculeParsing.parseTarget(
    { pdbId: pdbHint },
    callOpts(signal),
  );
  await emitStep(onEvent, "🧭 正在分析结合口袋与关键相互作用...", 950, signal);

  onEvent({ type: "stage", stage: "similar", label: "正在生成候选分子" });
  await emitStep(onEvent, "✨ 正在基于靶点约束生成候选分子...", 1000, signal);
  // REAL: docking.generateCandidates → generative model
  const candidates = await services.docking.generateCandidates(
    {
      pdbId: target.pdbId,
      seedSmiles: target.seedSmiles,
      entry: "target",
    },
    callOpts(signal),
  );
  onEvent({ type: "candidates", items: candidates.candidates });
  onEvent({
    type: "counts",
    counts: { candidates: candidates.candidates.length },
  });

  onEvent({ type: "stage", stage: "admet", label: "正在评估亲和力与 ADMET" });
  await emitStep(onEvent, "📐 正在评估配体-靶点亲和力...", 900, signal);
  // REAL: docking.evaluateAffinity → Vina / Glide worker
  const affinity = await services.docking.evaluateAffinity(
    { pdbId: target.pdbId, smiles: target.seedSmiles },
    callOpts(signal),
  );
  await emitStep(onEvent, "🔧正在进行ADMET多目标评估...", 1000, signal);
  const admet = await services.admet.predict(
    {
      smiles: target.seedSmiles,
      mode: "target",
      extraProperties: [
        { key: "pdb", label: "靶点 PDB", value: target.pdbId },
        {
          key: "dock",
          label: "预估对接分 (mock)",
          value: affinity.dockingScore,
        },
      ],
    },
    callOpts(signal),
  );
  onEvent({ type: "input_molecule", molecule: admet.molecule });

  await emitStep(onEvent, "🧬 正在检索口袋相似分子...", 800, signal);
  const similar = await services.knowledge.searchSimilar(
    {
      smiles: target.seedSmiles,
      entry: "target",
      pdbId: target.pdbId,
    },
    callOpts(signal),
  );
  onEvent({ type: "similar", items: similar.items });

  onEvent({ type: "stage", stage: "literature", label: "正在检索文献知识库" });
  await emitStep(onEvent, "📚 正在检索文献知识库...", 750, signal);
  const literature = await services.knowledge.searchLiterature(
    {
      query: request,
      entry: "target",
      smiles: target.seedSmiles,
      pdbId: target.pdbId,
    },
    callOpts(signal),
  );
  onEvent({ type: "literature", items: literature.items });

  onEvent({ type: "stage", stage: "routes", label: "正在生成优化路线" });
  await emitStep(
    onEvent,
    "🧪 正在生成亲和力-ADMET 同步优化路线...",
    1100,
    signal,
  );
  const routes = await services.llm.generateRoutes(
    {
      entry: "target",
      userText: request,
      smiles: target.seedSmiles,
      pdbId: target.pdbId,
      similarCount: similar.items.length,
    },
    callOpts(signal),
  );
  onEvent({ type: "routes", items: routes.routes });

  return routes.summary;
}

/**
 * Sequential agent runner — orchestrates service abstractions.
 * UI still consumes WorkflowEvent stream; services are swappable for real APIs.
 */
export async function runMockWorkflow(options: RunOptions): Promise<void> {
  const { request, onEvent, signal, entry: explicitEntry } = options;
  // REAL: inject createDrugAgentServices({ ...http clients }) at app bootstrap.
  const services = options.services ?? createMockDrugAgentServices();

  const intent = await services.llm.parseIntent(
    { userText: request, hintEntry: explicitEntry },
    callOpts(signal),
  );
  const entry = intent.entry;

  const startedAt = Date.now();
  const tickTimer = window.setInterval(() => {
    if (signal?.aborted) return;
    onEvent({
      type: "tick",
      elapsedSec: Math.floor((Date.now() - startedAt) / 1000),
    });
  }, 1000);

  try {
    await runSharedIntake(onEvent, signal);

    let summary: string;
    if (entry === "upload") {
      summary = await runUploadPath(
        services,
        request,
        intent.intentLabel,
        onEvent,
        signal,
      );
    } else if (entry === "target") {
      summary = await runTargetPath(
        services,
        request,
        intent.intentLabel,
        onEvent,
        signal,
      );
    } else {
      summary = await runSmilesPath(
        services,
        request,
        intent.intentLabel,
        onEvent,
        signal,
      );
    }

    onEvent({ type: "summary", text: summary });
    onEvent({ type: "done" });
  } finally {
    window.clearInterval(tickTimer);
  }
}

export function formatElapsed(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export type { WorkflowEntry };
