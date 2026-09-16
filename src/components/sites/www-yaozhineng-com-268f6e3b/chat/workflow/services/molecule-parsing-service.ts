import { getPayloadForEntry, type WorkflowEntry } from "../mock-payload";
import type {
  MoleculeParsingService,
  ParseImageRequest,
  ParseSmilesRequest,
  ParseTargetRequest,
  ParsedMolecule,
  ParsedTarget,
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

function entryPayload(entry: WorkflowEntry) {
  return getPayloadForEntry(entry);
}

/**
 * Mock molecule parsing — returns existing mock SMILES / properties.
 *
 * REAL HOOK:
 *   - Image: OCSR / MolScribe microservice accepting multipart image bytes.
 *   - SMILES: RDKit canonicalize + descriptor endpoint.
 *   - PDB: RCSB fetch + pocket detection API.
 */
export function createMockMoleculeParsingService(): MoleculeParsingService {
  return {
    async parseFromImage(
      request: ParseImageRequest,
      options?: ServiceCallOptions,
    ): Promise<ParsedMolecule> {
      await delay(200, options?.signal);
      const payload = entryPayload("upload");
      return {
        smiles: payload.smiles,
        label: payload.inputMolecule.label,
        properties: [...payload.inputMolecule.properties],
        structureLabel: request.imageRef || payload.structureLabel,
      };
    },

    async parseFromSmiles(
      request: ParseSmilesRequest,
      options?: ServiceCallOptions,
    ): Promise<ParsedMolecule> {
      await delay(120, options?.signal);
      const payload = entryPayload("smiles");
      // Prefer caller SMILES; fall back to canned mock molecule.
      const smiles = request.smiles.trim() || payload.smiles;
      return {
        smiles,
        label: payload.inputMolecule.label,
        properties: [...payload.inputMolecule.properties],
      };
    },

    async parseTarget(
      request: ParseTargetRequest,
      options?: ServiceCallOptions,
    ): Promise<ParsedTarget> {
      await delay(200, options?.signal);
      const payload = entryPayload("target");
      return {
        pdbId: request.pdbId || payload.pdbId || "8fln",
        pocketSummary: "结合口袋与关键相互作用已解析（mock）",
        seedSmiles: payload.smiles,
      };
    },
  };
}
