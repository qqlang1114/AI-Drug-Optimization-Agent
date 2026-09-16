/** Backend-ready workflow types (mock today, API-shaped later). */

export type TaskStage =
  | "idle"
  | "intake"
  | "intent"
  | "admet"
  | "similar"
  | "literature"
  | "routes"
  | "done"
  | "error";

export type WorkflowStep = {
  id: string;
  text: string;
  done: boolean;
};

export type SimilarMolecule = {
  id: string;
  index: number;
  similarity: number;
  method: string;
  smiles: string;
  rationale: string;
};

export type MoleculeProperty = {
  key: string;
  label: string;
  value: string | number;
};

export type AdmetMetric = {
  key: string;
  label: string;
  value: string | number;
  reference: string;
};

export type AdmetCategory = {
  id: string;
  title: string;
  /** CSS tint hint: absorption | distribution | metabolism | excretion | toxicity */
  tone: "absorption" | "distribution" | "metabolism" | "excretion" | "toxicity";
  metrics: AdmetMetric[];
};

export type InputMolecule = {
  smiles: string;
  label: string;
  properties: MoleculeProperty[];
  admet: AdmetCategory[];
};

export type OptimizationRoute = {
  id: string;
  index: number;
  title: string;
  strategy: string;
  modification: string;
  targetProperties: string[];
  proposedSmiles: string;
  notes: string;
};

export type CandidateMolecule = {
  id: string;
  index: number;
  smiles: string;
  scoreLabel: string;
  score: number;
  highlights: string[];
};

export type LiteratureItem = {
  id: string;
  title: string;
  venue?: string;
  year?: number;
  snippet: string;
  url?: string;
};

export type WorkflowCounts = {
  similar: number;
  routes: number;
  candidates: number;
};

/** Live + persisted UI state for one agent run. */
export type WorkflowUiState = {
  taskId: string;
  sessionId: string;
  request: string;
  active: boolean;
  stage: TaskStage;
  stageLabel: string;
  queueAhead: number;
  elapsedSec: number;
  thinkingOpen: boolean;
  showIntake: boolean;
  showPhaseDock: boolean;
  steps: WorkflowStep[];
  similar: SimilarMolecule[];
  inputMolecule: InputMolecule | null;
  literature: LiteratureItem[];
  routes: OptimizationRoute[];
  candidates: CandidateMolecule[];
  counts: WorkflowCounts;
  summary?: string;
};

export type WorkflowEvent =
  | { type: "stage"; stage: TaskStage; label: string }
  | { type: "step_add"; step: WorkflowStep }
  | { type: "step_done"; stepId: string }
  | { type: "intake"; visible: boolean; queueAhead: number }
  | { type: "phase_dock"; visible: boolean }
  | { type: "similar"; items: SimilarMolecule[] }
  | { type: "input_molecule"; molecule: InputMolecule }
  | { type: "literature"; items: LiteratureItem[] }
  | { type: "routes"; items: OptimizationRoute[] }
  | { type: "candidates"; items: CandidateMolecule[] }
  | { type: "counts"; counts: Partial<WorkflowCounts> }
  | { type: "summary"; text: string }
  | { type: "tick"; elapsedSec: number }
  | { type: "done" }
  | { type: "error"; message: string };
