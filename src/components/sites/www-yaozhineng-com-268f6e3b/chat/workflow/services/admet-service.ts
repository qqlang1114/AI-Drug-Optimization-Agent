import { getPayloadForEntry } from "../mock-payload";
import type {
  AdmetPredictRequest,
  AdmetPredictResponse,
  AdmetPredictionService,
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
 * Mock ADMET prediction — returns panels from mock-payload.
 *
 * REAL HOOK:
 *   POST /api/admet/predict  with { smiles, assays[] }
 *   Map model outputs into AdmetCategory / AdmetMetric shapes used by UI cards.
 */
export function createMockAdmetPredictionService(): AdmetPredictionService {
  return {
    async predict(
      request: AdmetPredictRequest,
      options?: ServiceCallOptions,
    ): Promise<AdmetPredictResponse> {
      await delay(220, options?.signal);
      const payload = getPayloadForEntry(request.mode);
      const base = payload.inputMolecule;
      const propertyMap = new Map(
        base.properties.map((prop) => [prop.key, prop] as const),
      );
      for (const prop of request.extraProperties || []) {
        propertyMap.set(prop.key, prop);
      }

      return {
        molecule: {
          smiles: request.smiles || base.smiles,
          label: request.label || base.label,
          properties: [...propertyMap.values()],
          admet: base.admet.map((category) => ({
            ...category,
            metrics: [...category.metrics],
          })),
        },
      };
    },
  };
}
