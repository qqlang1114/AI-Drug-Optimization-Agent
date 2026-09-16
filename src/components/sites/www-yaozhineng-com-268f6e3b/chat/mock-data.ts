import { cardBg1Src, cardBg2Src, exampleMoleculeSrc } from "./assets";
import type { WorkflowEntry } from "./workflow/mock-payload";
import type { WorkflowUiState } from "./workflow/types";

export type MockConversation = {
  id: string;
  title: string;
  updatedAt: string;
};

export type MessageAttachment = {
  type: "image";
  name: string;
  url: string;
};

export type MockMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** text = plain bubble; workflow = structured agent run payload */
  kind?: "text" | "workflow";
  workflow?: WorkflowUiState;
  attachments?: MessageAttachment[];
};

/** Mock structure upload used by upload card + first quick action. */
export const MOCK_MOLECULE_ATTACHMENT: MessageAttachment = {
  type: "image",
  name: "example-molecule.png",
  url: exampleMoleculeSrc,
};

export type QuickAction = {
  label: string;
  prompt: string;
  entry: WorkflowEntry;
  attachments?: MessageAttachment[];
};

/** Welcome chip buttons — click starts workflow immediately (no composer fill). */
export const QUICK_ACTIONS: readonly QuickAction[] = [
  {
    label: "请对这个分子结构进行成药性优化",
    prompt: "请对这个分子结构进行成药性优化",
    entry: "upload",
    attachments: [MOCK_MOLECULE_ATTACHMENT],
  },
  {
    label: "请改善这个分子的代谢稳定性并降低肝毒性",
    prompt:
      "SMILES: Cc1ccc(NC(=O)c2cn[nH]c2)cc1，请改善代谢稳定性并降低肝毒性风险。",
    entry: "smiles",
  },
  {
    label: "请面向靶点PDB 8fln生成优质候选分子",
    prompt: "请面向靶点PDB 8fln生成优质候选分子",
    entry: "target",
  },
] as const;

/** @deprecated use QUICK_ACTIONS */
export const SUGGESTED_PROMPTS = QUICK_ACTIONS.map((action) => action.label);

export const FEATURE_CARDS = [
  {
    id: "upload" as const,
    title: "上传分子结构图进行成药性优化",
    desc: "上传化合物结构图，一站式开展成药性多维度综合优化",
    footer: "@ADMET综合指标优化",
    background: cardBg1Src,
    prompt: "请对这个分子结构进行成药性优化",
    attachments: [MOCK_MOLECULE_ATTACHMENT] as MessageAttachment[],
  },
  {
    id: "smiles" as const,
    title: "输入SMILES串进行单项成药性优化",
    desc: "输入SMILES串，精准开展指定成药性指标专项优化",
    footer: "@ADMET单项指标优化",
    background: cardBg2Src,
    prompt:
      "SMILES: Cc1ccc(NC(=O)c2cn[nH]c2)cc1，请改善代谢稳定性并降低肝毒性风险。",
  },
  {
    id: "target" as const,
    title: "基于靶点结构进行亲和力和成药性多目标优化",
    desc: "围绕药物靶点，同步实现分子亲和力与成药性多目标优化",
    footer: "@靶点-配体亲和力与ADMET同步优化",
    background: cardBg1Src,
    prompt: "请基于PDB 8fln生成一些候选化合物",
  },
] as const;
