/**
 * Drug-agent service contracts.
 *
 * Swap mock implementations for real HTTP / model clients that honor these
 * request/response shapes — UI components stay unchanged.
 */

import type {
  CandidateMolecule,
  InputMolecule,
  LiteratureItem,
  OptimizationRoute,
  SimilarMolecule,
} from "../types";
import type { WorkflowEntry } from "../mock-payload";

/** Shared abort / tracing options for every service call. */
export type ServiceCallOptions = {
  signal?: AbortSignal;
  /** Optional correlation id for future request tracing. */
  requestId?: string;
};

/* -------------------------------------------------------------------------- */
/* LLM service                                                                */
/* -------------------------------------------------------------------------- */

export type LlmIntentRequest = {
  userText: string;
  /** Explicit entry from feature cards; omit to let the LLM infer. */
  hintEntry?: WorkflowEntry;
};

export type LlmIntentResponse = {
  entry: WorkflowEntry;
  intentLabel: string;
  thinkingSteps: string[];
  optimizationGoals: string[];
};

export type LlmRouteRequest = {
  entry: WorkflowEntry;
  userText: string;
  smiles: string;
  pdbId?: string;
  admetSummary?: string;
  similarCount?: number;
};

export type LlmRouteResponse = {
  routes: OptimizationRoute[];
  summary: string;
};

export type LlmService = {
  /**
   * Classify user intent into one of the three product entry points.
   *
   * REAL: POST /api/llm/intent  or  call chat-completion with tool schema.
   */
  parseIntent(
    request: LlmIntentRequest,
    options?: ServiceCallOptions,
  ): Promise<LlmIntentResponse>;

  /**
   * Produce optimization routes + closing summary from structured context.
   *
   * REAL: POST /api/llm/routes  or  fine-tuned chemistry LLM.
   */
  generateRoutes(
    request: LlmRouteRequest,
    options?: ServiceCallOptions,
  ): Promise<LlmRouteResponse>;
};

/* -------------------------------------------------------------------------- */
/* Molecule parsing service                                                   */
/* -------------------------------------------------------------------------- */

export type ParseImageRequest = {
  /** Simulated upload filename or future object-storage URL / blob id. */
  imageRef: string;
  userText?: string;
};

export type ParseSmilesRequest = {
  smiles: string;
};

export type ParseTargetRequest = {
  pdbId: string;
};

export type ParsedMolecule = {
  smiles: string;
  label: string;
  properties: InputMolecule["properties"];
  structureLabel?: string;
};

export type ParsedTarget = {
  pdbId: string;
  pocketSummary: string;
  seedSmiles: string;
};

export type MoleculeParsingService = {
  /**
   * Structure-from-image recognition (upload entry).
   *
   * REAL: multipart upload → CV / OCSR model (e.g. MolScribe) → SMILES.
   */
  parseFromImage(
    request: ParseImageRequest,
    options?: ServiceCallOptions,
  ): Promise<ParsedMolecule>;

  /**
   * Validate / enrich a SMILES string (SMILES entry).
   *
   * REAL: RDKit / OpenBabel canonicalize + descriptor calc.
   */
  parseFromSmiles(
    request: ParseSmilesRequest,
    options?: ServiceCallOptions,
  ): Promise<ParsedMolecule>;

  /**
   * Load target structure metadata (target entry).
   *
   * REAL: fetch PDB / AlphaFold → pocket detection service.
   */
  parseTarget(
    request: ParseTargetRequest,
    options?: ServiceCallOptions,
  ): Promise<ParsedTarget>;
};

/* -------------------------------------------------------------------------- */
/* ADMET prediction service                                                   */
/* -------------------------------------------------------------------------- */

export type AdmetPredictRequest = {
  smiles: string;
  /** upload = multi-metric; smiles = property-focused; target = multi-objective */
  mode: WorkflowEntry;
  label?: string;
  /** Extra properties to merge (e.g. PDB id, docking score). */
  extraProperties?: InputMolecule["properties"];
};

export type AdmetPredictResponse = {
  molecule: InputMolecule;
};

export type AdmetPredictionService = {
  /**
   * Predict ADMET panels for a molecule.
   *
   * REAL: POST /api/admet/predict  (ADMET-AI, SwissADMET, in-house QSAR, …).
   */
  predict(
    request: AdmetPredictRequest,
    options?: ServiceCallOptions,
  ): Promise<AdmetPredictResponse>;
};

/* -------------------------------------------------------------------------- */
/* Knowledge retrieval service                                                */
/* -------------------------------------------------------------------------- */

export type SimilarSearchRequest = {
  smiles: string;
  entry: WorkflowEntry;
  pdbId?: string;
  limit?: number;
};

export type LiteratureSearchRequest = {
  query: string;
  entry: WorkflowEntry;
  smiles?: string;
  pdbId?: string;
  limit?: number;
};

export type SimilarSearchResponse = {
  items: SimilarMolecule[];
};

export type LiteratureSearchResponse = {
  items: LiteratureItem[];
};

export type KnowledgeRetrievalService = {
  /**
   * Nearest-neighbor / substructure similar molecules.
   *
   * REAL: vector DB (Morgan FP / ChemBERTa) or ChEMBL similarity API.
   */
  searchSimilar(
    request: SimilarSearchRequest,
    options?: ServiceCallOptions,
  ): Promise<SimilarSearchResponse>;

  /**
   * Literature / patent snippets for optimization rationale.
   *
   * REAL: RAG over PubMed / internal corpus via embedding search.
   */
  searchLiterature(
    request: LiteratureSearchRequest,
    options?: ServiceCallOptions,
  ): Promise<LiteratureSearchResponse>;
};

/* -------------------------------------------------------------------------- */
/* Docking / generation service                                               */
/* -------------------------------------------------------------------------- */

export type GenerateCandidatesRequest = {
  pdbId: string;
  seedSmiles?: string;
  entry: WorkflowEntry;
  limit?: number;
};

export type AffinityEvaluateRequest = {
  pdbId: string;
  smiles: string;
};

export type AffinityEvaluateResponse = {
  dockingScore: number;
  highlights: string[];
};

export type GenerateCandidatesResponse = {
  candidates: CandidateMolecule[];
};

export type DockingGenerationService = {
  /**
   * Enumerate pocket-constrained candidate ligands.
   *
   * REAL: generative model (DiffDock / REINVENT / in-house) conditioned on PDB.
   */
  generateCandidates(
    request: GenerateCandidatesRequest,
    options?: ServiceCallOptions,
  ): Promise<GenerateCandidatesResponse>;

  /**
   * Score ligand–target affinity.
   *
   * REAL: docking engine (AutoDock Vina, Glide, …) or learned affinity model.
   */
  evaluateAffinity(
    request: AffinityEvaluateRequest,
    options?: ServiceCallOptions,
  ): Promise<AffinityEvaluateResponse>;
};

/* -------------------------------------------------------------------------- */
/* Bundled agent services                                                     */
/* -------------------------------------------------------------------------- */

export type DrugAgentServices = {
  llm: LlmService;
  moleculeParsing: MoleculeParsingService;
  admet: AdmetPredictionService;
  knowledge: KnowledgeRetrievalService;
  docking: DockingGenerationService;
};
