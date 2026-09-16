import { getPayloadForEntry } from "../mock-payload";
import type {
  AffinityEvaluateRequest,
  AffinityEvaluateResponse,
  DockingGenerationService,
  GenerateCandidatesRequest,
  GenerateCandidatesResponse,
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

/**
 * Mock docking / generation — candidates + affinity scores from mock-payload.
 *
 * REAL HOOK:
 *   - generateCandidates → generative chemistry API conditioned on pocket.
 *   - evaluateAffinity → docking cluster (Vina/Glide) or learned scorer.
 */
export function createMockDockingGenerationService(): DockingGenerationService {
  return {
    async generateCandidates(
      request: GenerateCandidatesRequest,
      options?: ServiceCallOptions,
    ): Promise<GenerateCandidatesResponse> {
      await delay(200, options?.signal);
      const payload = getPayloadForEntry(request.entry);
      const limit = request.limit ?? payload.candidates.length;
      return {
        candidates: payload.candidates.slice(0, limit).map((item) => ({
          ...item,
        })),
      };
    },

    async evaluateAffinity(
      request: AffinityEvaluateRequest,
      options?: ServiceCallOptions,
    ): Promise<AffinityEvaluateResponse> {
      await delay(150, options?.signal);
      // REAL: pass { pdbId, smiles } to docking worker; map pose scores here.
      void request;
      return {
        dockingScore: -8.4,
        highlights: ["对接分改善", "口袋互补", "ADMET 可接受"],
      };
    },
  };
}
