/**
 * Drug-agent service registry.
 *
 * Today: all mocks. Tomorrow: replace individual factories with HTTP clients
 * that implement the same interfaces in `./types`.
 */

import { createMockAdmetPredictionService } from "./admet-service";
import { createMockDockingGenerationService } from "./docking-generation-service";
import { createMockKnowledgeRetrievalService } from "./knowledge-retrieval-service";
import { createMockLlmService } from "./llm-service";
import { createMockMoleculeParsingService } from "./molecule-parsing-service";
import type { DrugAgentServices } from "./types";

export type { DrugAgentServices } from "./types";
export type {
  AdmetPredictRequest,
  AdmetPredictResponse,
  AdmetPredictionService,
  AffinityEvaluateRequest,
  AffinityEvaluateResponse,
  DockingGenerationService,
  GenerateCandidatesRequest,
  GenerateCandidatesResponse,
  KnowledgeRetrievalService,
  LiteratureSearchRequest,
  LiteratureSearchResponse,
  LlmIntentRequest,
  LlmIntentResponse,
  LlmRouteRequest,
  LlmRouteResponse,
  LlmService,
  MoleculeParsingService,
  ParseImageRequest,
  ParseSmilesRequest,
  ParseTargetRequest,
  ParsedMolecule,
  ParsedTarget,
  ServiceCallOptions,
  SimilarSearchRequest,
  SimilarSearchResponse,
} from "./types";

/** Default mock bundle used by the chat workflow runner. */
export function createMockDrugAgentServices(): DrugAgentServices {
  return {
    llm: createMockLlmService(),
    moleculeParsing: createMockMoleculeParsingService(),
    admet: createMockAdmetPredictionService(),
    knowledge: createMockKnowledgeRetrievalService(),
    docking: createMockDockingGenerationService(),
  };
}

/**
 * REAL HOOK — compose production clients, e.g.:
 *
 *   createDrugAgentServices({
 *     llm: createHttpLlmService(process.env.LLM_BASE_URL),
 *     moleculeParsing: createHttpMoleculeParsingService(...),
 *     admet: createHttpAdmetService(...),
 *     knowledge: createHttpKnowledgeService(...),
 *     docking: createHttpDockingService(...),
 *   })
 */
export function createDrugAgentServices(
  overrides: Partial<DrugAgentServices> = {},
): DrugAgentServices {
  return {
    ...createMockDrugAgentServices(),
    ...overrides,
  };
}
