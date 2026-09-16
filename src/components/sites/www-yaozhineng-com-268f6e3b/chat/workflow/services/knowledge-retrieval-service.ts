import { getPayloadForEntry } from "../mock-payload";
import type {
  KnowledgeRetrievalService,
  LiteratureSearchRequest,
  LiteratureSearchResponse,
  ServiceCallOptions,
  SimilarSearchRequest,
  SimilarSearchResponse,
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
 * Mock knowledge retrieval — similar molecules + literature from mock-payload.
 *
 * REAL HOOK:
 *   - Similar: fingerprint / embedding ANN over ChEMBL or internal library.
 *   - Literature: RAG over PubMed / patents (vector store + citation formatter).
 */
export function createMockKnowledgeRetrievalService(): KnowledgeRetrievalService {
  return {
    async searchSimilar(
      request: SimilarSearchRequest,
      options?: ServiceCallOptions,
    ): Promise<SimilarSearchResponse> {
      await delay(160, options?.signal);
      const payload = getPayloadForEntry(request.entry);
      const limit = request.limit ?? payload.similar.length;
      return { items: payload.similar.slice(0, limit).map((item) => ({ ...item })) };
    },

    async searchLiterature(
      request: LiteratureSearchRequest,
      options?: ServiceCallOptions,
    ): Promise<LiteratureSearchResponse> {
      await delay(160, options?.signal);
      const payload = getPayloadForEntry(request.entry);
      const limit = request.limit ?? payload.literature.length;
      return {
        items: payload.literature.slice(0, limit).map((item) => ({ ...item })),
      };
    },
  };
}
