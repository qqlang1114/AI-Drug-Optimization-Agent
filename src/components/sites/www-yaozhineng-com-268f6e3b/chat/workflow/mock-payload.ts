import type {
  CandidateMolecule,
  InputMolecule,
  LiteratureItem,
  OptimizationRoute,
  SimilarMolecule,
} from "./types";

/** Original product entry points (three feature cards). */
export type WorkflowEntry = "upload" | "smiles" | "target";

export type WorkflowPayload = {
  entry: WorkflowEntry;
  smiles: string;
  pdbId?: string;
  structureLabel?: string;
  similar: SimilarMolecule[];
  inputMolecule: InputMolecule;
  literature: LiteratureItem[];
  routes: OptimizationRoute[];
  candidates: CandidateMolecule[];
  summary: string;
};

const BASE_MOLECULE_PROPS: InputMolecule["properties"] = [
  { key: "mw", label: "分子量", value: 201.23 },
  { key: "formula", label: "分子式", value: "C11H11N3O" },
  { key: "logp", label: "脂水分配系数 (LogP)", value: 1.97 },
  { key: "sa", label: "合成难度（SA)", value: 1.86 },
  { key: "tpsa", label: "拓扑极性表面积 (TPSA)", value: 57.78 },
  { key: "hbd", label: "氢键供体数量", value: 2.0 },
  { key: "hba", label: "氢键受体数量", value: 2.0 },
  { key: "rotb", label: "可旋转键数量", value: 2.0 },
  { key: "aromatic", label: "芳香环数量", value: 2.0 },
  { key: "heavy", label: "重原子数量", value: 15.0 },
  { key: "charge", label: "电荷", value: 0 },
];

const BASE_ADMET: InputMolecule["admet"] = [
  {
    id: "absorption",
    title: "吸收 (Absorption)",
    tone: "absorption",
    metrics: [
      {
        key: "hia",
        label: "人体肠道吸收率",
        value: "1.000",
        reference: "参考: >0.3 较好",
      },
      {
        key: "caco2",
        label: "Caco-2 通透性",
        value: "-4.79",
        reference: "参考: >-5.15 高通透",
      },
      {
        key: "f20",
        label: "口服生物利用度",
        value: "0.923",
        reference: "参考: >30% 较好",
      },
      {
        key: "logs",
        label: "水溶性 (LogS)",
        value: "-3.61",
        reference: "参考: >-4.0 较好",
      },
      {
        key: "lipo",
        label: "亲脂性指标",
        value: "2.09",
        reference: "参考: 1.0~3.0 理想",
      },
    ],
  },
  {
    id: "distribution",
    title: "分布 (Distribution)",
    tone: "distribution",
    metrics: [
      {
        key: "pgp",
        label: "P-糖蛋白底物",
        value: "0.047",
        reference: "参考: <0.5 非底物",
      },
      {
        key: "bbb",
        label: "血脑屏障通透",
        value: "0.696",
        reference: "参考: <0.1 非通透",
      },
      {
        key: "ppb",
        label: "血浆蛋白结合率",
        value: "84.46",
        reference: "参考: <90% 较好",
      },
      {
        key: "vdss",
        label: "稳态分布容积",
        value: "3.42",
        reference: "参考: 0.5~2.0 L/kg",
      },
    ],
  },
  {
    id: "metabolism",
    title: "代谢 (Metabolism)",
    tone: "metabolism",
    metrics: [
      {
        key: "cyp2d6i",
        label: "CYP2D6 抑制",
        value: "0.039",
        reference: "参考: <0.5 低风险",
      },
      {
        key: "cyp3a4i",
        label: "CYP3A4 抑制",
        value: "0.156",
        reference: "参考: <0.5 低风险",
      },
      {
        key: "cyp2c9i",
        label: "CYP2C9 抑制",
        value: "0.394",
        reference: "参考: <0.5 低风险",
      },
      {
        key: "cyp2d6s",
        label: "CYP2D6 底物概率",
        value: "0.083",
        reference: "参考: <0.5 概率低",
      },
      {
        key: "cyp3a4s",
        label: "CYP3A4 底物概率",
        value: "0.355",
        reference: "参考: <0.5 概率低",
      },
      {
        key: "cyp2c9s",
        label: "CYP2C9 底物概率",
        value: "0.354",
        reference: "参考: <0.5 概率低",
      },
    ],
  },
  {
    id: "excretion",
    title: "排泄 (Excretion)",
    tone: "excretion",
    metrics: [
      {
        key: "t12",
        label: "半衰期 (h)",
        value: "18.98",
        reference: "参考: >2h 较好",
      },
      {
        key: "clmic",
        label: "微粒体清除率",
        value: "23.02",
        reference: "参考: <30 较低",
      },
      {
        key: "clhep",
        label: "肝细胞清除率",
        value: "61.71",
        reference: "参考: <15 较低/稳定",
      },
    ],
  },
  {
    id: "toxicity",
    title: "毒性 (Toxicity)",
    tone: "toxicity",
    metrics: [
      {
        key: "herg",
        label: "hERG 心脏毒性",
        value: "0.175",
        reference: "参考: <0.5 低风险",
      },
      {
        key: "ames",
        label: "AMES 致突变性",
        value: "0.063",
        reference: "参考: <0.5 阴性",
      },
      {
        key: "dili",
        label: "肝损伤风险",
        value: "0.921",
        reference: "参考: <0.5 低风险",
      },
      {
        key: "ld50",
        label: "急性毒性 (LD50)",
        value: "1.90",
        reference: "参考: 越高越安全",
      },
    ],
  },
];

const SHARED_SIMILAR: SimilarMolecule[] = [
  {
    id: "sim-1",
    index: 1,
    similarity: 73.3,
    method: "L2_SUBSTRUCT",
    smiles: "Cc1ccc(NC(=O)C(S)CC(C)C)cc1",
    rationale: "共享大量公共子结构 (MCS覆盖率: 0.73)，可能面临类似的优化问题。",
  },
  {
    id: "sim-2",
    index: 2,
    similarity: 73.3,
    method: "L2_SUBSTRUCT",
    smiles: "NCc1ccc(NC(=O)c2ccccc2O)cc1",
    rationale: "共享大量公共子结构 (MCS覆盖率: 0.73)，可能面临类似的优化问题。",
  },
  {
    id: "sim-3",
    index: 3,
    similarity: 66.7,
    method: "L2_SUBSTRUCT",
    smiles: "CCOc1ccc(NC(C)=O)cc1Cl",
    rationale: "共享大量公共子结构 (MCS覆盖率: 0.67)，可能面临类似的优化问题。",
  },
  {
    id: "sim-4",
    index: 4,
    similarity: 60.0,
    method: "L2_SUBSTRUCT",
    smiles: "CNc1ccc(-c2nnn(C)n2)cc1",
    rationale: "共享大量公共子结构 (MCS覆盖率: 0.60)，可能面临类似的优化问题。",
  },
  {
    id: "sim-5",
    index: 5,
    similarity: 60.0,
    method: "L2_SUBSTRUCT",
    smiles: "CN(CC(=O)NNC(=O)CCl)c1ccc(Cl)cc1",
    rationale: "共享大量公共子结构 (MCS覆盖率: 0.60)，可能面临类似的优化问题。",
  },
];

/** 1) Upload structure → multi-metric ADMET optimization */
export const MOCK_UPLOAD_PAYLOAD: WorkflowPayload = {
  entry: "upload",
  smiles: "Cc1ccc(NC(=O)c2cn[nH]c2)cc1",
  structureLabel: "example-molecule.png",
  similar: SHARED_SIMILAR,
  inputMolecule: {
    smiles: "Cc1ccc(NC(=O)c2cn[nH]c2)cc1",
    label: "结构识别分子 (Parsed from Image)",
    properties: BASE_MOLECULE_PROPS,
    admet: BASE_ADMET,
  },
  literature: [
    {
      id: "lit-u1",
      title: "Image-to-structure pipelines for early ADMET triage",
      venue: "J. Chem. Inf. Model.",
      year: 2022,
      snippet:
        "Structure recognition from sketches enables rapid multi-parameter ADMET profiling before synthetic commitment.",
    },
  ],
  routes: [
    {
      id: "route-u1",
      index: 1,
      title: "优化路线 1 · ADMET 综合平衡",
      strategy: "多维度成药性综合优化",
      modification:
        "基于结构图解析骨架，同步调整极性、清除率与毒性预警位点。",
      targetProperties: ["吸收", "代谢", "毒性"],
      proposedSmiles: "COc1ccc(NC(=O)c2cn[nH]c2)cc1",
      notes: "对应原站「上传结构图 → 综合 ADMET 优化」路径。",
    },
    {
      id: "route-u2",
      index: 2,
      title: "优化路线 2 · 结构软位点修复",
      strategy: "综合成药性",
      modification: "针对识别出的氧化软位点进行局部修饰，保留核心骨架。",
      targetProperties: ["代谢稳定性", "合成可达性"],
      proposedSmiles: "Cc1ccc(NC(=O)c2cn(C)nc2)cc1",
      notes: "结构图输入场景下的综合路线草案。",
    },
  ],
  candidates: [
    {
      id: "cand-u1",
      index: 1,
      smiles: "COc1ccc(NC(=O)c2cn[nH]c2)cc1",
      scoreLabel: "综合成药性",
      score: 0.8,
      highlights: ["结构识别成功", "ADMET 综合改善"],
    },
  ],
  summary:
    "已完成结构图成药性优化演示：模拟识别 example-molecule.png → 解析分子 → ADMET 综合评估 → 生成综合优化路线（本地 mock）。",
};

/** 2) SMILES single-property optimization (metabolism / hepatotoxicity) */
export const MOCK_SMILES_PAYLOAD: WorkflowPayload = {
  entry: "smiles",
  smiles: "Cc1ccc(NC(=O)c2cn[nH]c2)cc1",
  similar: SHARED_SIMILAR,
  inputMolecule: {
    smiles: "Cc1ccc(NC(=O)c2cn[nH]c2)cc1",
    label: "初始分子 (Input Molecule)",
    properties: BASE_MOLECULE_PROPS,
    admet: BASE_ADMET,
  },
  literature: [
    {
      id: "lit-1",
      title: "Metabolic soft-spot analysis of amide-containing lead compounds",
      venue: "J. Med. Chem.",
      year: 2021,
      snippet:
        "Amide linkers are frequent CYP-mediated soft spots; local steric shielding improves microsomal stability.",
      url: "https://pubmed.ncbi.nlm.nih.gov/",
    },
    {
      id: "lit-2",
      title: "Strategies to mitigate hepatotoxicity risk in early discovery",
      venue: "Drug Metab. Rev.",
      year: 2020,
      snippet:
        "Reactive metabolite alerts and hepatic clearance panels guide property-specific optimization.",
    },
  ],
  routes: [
    {
      id: "route-1",
      index: 1,
      title: "优化路线 1 · 酰胺位阻屏蔽",
      strategy: "提升代谢稳定性",
      modification:
        "在酰胺邻位引入小位阻甲基，降低 CYP 介导的氧化切割倾向。",
      targetProperties: ["代谢稳定性", "微粒体清除率"],
      proposedSmiles: "Cc1ccc(NC(=O)c2cn(C)[nH]c2C)cc1",
      notes: "单项指标：代谢稳定性。",
    },
    {
      id: "route-2",
      index: 2,
      title: "优化路线 2 · 极性微调降肝毒",
      strategy: "降低肝损伤风险",
      modification:
        "用唑类生物电子等排替换部分芳环，调节脂溶性并降低反应性代谢物风险。",
      targetProperties: ["肝损伤风险", "LogP", "TPSA"],
      proposedSmiles: "Cc1ccc(NC(=O)c2ncc[nH]2)cc1",
      notes: "单项/联合指标：肝毒性。",
    },
    {
      id: "route-3",
      index: 3,
      title: "优化路线 3 · 代谢+肝毒折中",
      strategy: "代谢稳定性 + 肝毒性同步优化",
      modification: "组合弱吸电子取代与氢键供体重排，兼顾清除率与毒性预警。",
      targetProperties: ["代谢稳定性", "肝损伤风险", "hERG"],
      proposedSmiles: "COc1ccc(NC(=O)c2cn[nH]c2)cc1C",
      notes: "对应原站 SMILES 单项成药性优化路径。",
    },
  ],
  candidates: [
    {
      id: "cand-1",
      index: 1,
      smiles: "Cc1ccc(NC(=O)c2cn(C)[nH]c2C)cc1",
      scoreLabel: "代谢稳定性",
      score: 0.82,
      highlights: ["代谢风险↓", "DILI 预警改善"],
    },
    {
      id: "cand-2",
      index: 2,
      smiles: "Cc1ccc(NC(=O)c2ncc[nH]2)cc1",
      scoreLabel: "肝毒性风险",
      score: 0.78,
      highlights: ["肝毒风险↓", "LogP 更优"],
    },
  ],
  summary:
    "已完成 SMILES 单项成药性优化演示：聚焦代谢稳定性与肝毒性，完成 ADMET 评估、相似分子/文献检索，并生成针对性优化路线（本地 mock）。",
};

/** 3) Target-based affinity + ADMET multi-objective */
export const MOCK_TARGET_PAYLOAD: WorkflowPayload = {
  entry: "target",
  smiles: "Cc1ccc(NC(=O)c2cn[nH]c2)cc1",
  pdbId: "8fln",
  similar: [
    {
      id: "sim-t1",
      index: 1,
      similarity: 68.0,
      method: "POCKET_SIM",
      smiles: "Cc1ccc(Nc2ncc(C(=O)N)cn2)cc1",
      rationale: "与靶点口袋关键残基形成相似氢键网络，适合作为候选起点。",
    },
    {
      id: "sim-t2",
      index: 2,
      similarity: 61.5,
      method: "POCKET_SIM",
      smiles: "O=C(Nc1ccccc1)c1cn[nH]c1",
      rationale: "口袋形状互补性较好，可作为多目标优化的种子分子。",
    },
  ],
  inputMolecule: {
    smiles: "Cc1ccc(NC(=O)c2cn[nH]c2)cc1",
    label: "靶点导向种子分子 (Target-seeded)",
    properties: [
      ...BASE_MOLECULE_PROPS,
      { key: "pdb", label: "靶点 PDB", value: "8fln" },
      { key: "dock", label: "预估对接分 (mock)", value: -8.4 },
    ],
    admet: BASE_ADMET,
  },
  literature: [
    {
      id: "lit-t1",
      title: "Structure-based multi-objective lead optimization around PDB pockets",
      venue: "ACS Med. Chem. Lett.",
      year: 2023,
      snippet:
        "Joint optimization of docking score and ADMET reduces late-stage attrition for pocket-constrained series.",
    },
  ],
  routes: [
    {
      id: "route-t1",
      index: 1,
      title: "优化路线 1 · 口袋氢键增强",
      strategy: "提升靶点亲和力",
      modification: "在唑环引入氢键供体，增强与 8fln 口袋极性残基的相互作用。",
      targetProperties: ["亲和力", "对接姿态"],
      proposedSmiles: "Cc1ccc(NC(=O)c2cn[nH]c2N)cc1",
      notes: "靶点结构驱动的亲和力优化。",
    },
    {
      id: "route-t2",
      index: 2,
      title: "优化路线 2 · 亲和力-ADMET 多目标",
      strategy: "亲和力与成药性同步优化",
      modification: "在保持口袋占据的同时降低肝毒与清除率风险。",
      targetProperties: ["亲和力", "肝损伤风险", "代谢稳定性"],
      proposedSmiles: "COc1ccc(NC(=O)c2cn[nH]c2)cc1F",
      notes: "对应原站「靶点-配体亲和力与 ADMET 同步优化」。",
    },
  ],
  candidates: [
    {
      id: "cand-t1",
      index: 1,
      smiles: "Cc1ccc(NC(=O)c2cn[nH]c2N)cc1",
      scoreLabel: "亲和力+ADMET",
      score: 0.86,
      highlights: ["对接分改善", "ADMET 可接受", "PDB 8fln"],
    },
    {
      id: "cand-t2",
      index: 2,
      smiles: "COc1ccc(NC(=O)c2cn[nH]c2)cc1F",
      scoreLabel: "亲和力+ADMET",
      score: 0.81,
      highlights: ["多目标折中", "肝毒风险↓"],
    },
    {
      id: "cand-t3",
      index: 3,
      smiles: "Cc1ccc(Nc2ncc(C(=O)N)cn2)cc1",
      scoreLabel: "亲和力+ADMET",
      score: 0.79,
      highlights: ["口袋互补", "候选枚举"],
    },
  ],
  summary:
    "已完成靶点多目标优化演示：解析 PDB 8fln → 亲和力评估 → 候选生成 → ADMET 同步优化（本地 mock）。",
};

/** @deprecated use MOCK_SMILES_PAYLOAD — kept for compatibility */
export const MOCK_WORKFLOW_PAYLOAD = MOCK_SMILES_PAYLOAD;

export function extractSmiles(request: string): string | null {
  const match = request.match(/SMILES:\s*([^\s，,；;]+)/i);
  return match?.[1] ?? null;
}

export function extractPdbId(request: string): string | null {
  const match = request.match(/PDB\s*([0-9][A-Za-z0-9]{3})/i);
  return match?.[1]?.toLowerCase() ?? null;
}

/**
 * Map user text / feature-card prompts to the original three entry points.
 */
export function resolveWorkflowEntry(request: string): WorkflowEntry | null {
  const text = request.trim();
  if (!text) return null;

  // Exact / near-exact feature card & chip prompts
  if (
    text.includes("上传分子结构图") ||
    text.includes("example-molecule.png") ||
    text.includes("[结构图]") ||
    (/分子结构/.test(text) && !/SMILES\s*:/i.test(text) && !/PDB/i.test(text))
  ) {
    return "upload";
  }

  if (
    /SMILES\s*:/i.test(text) ||
    /代谢稳定性|肝毒性|单项成药性/.test(text)
  ) {
    return "smiles";
  }

  if (/PDB/i.test(text) || /靶点|亲和力|候选化合物|8fln/.test(text)) {
    return "target";
  }

  if (/成药性|优化|ADMET/.test(text)) {
    return "smiles";
  }

  return null;
}

export function looksLikeOptimizationRequest(request: string): boolean {
  return resolveWorkflowEntry(request) !== null;
}

export function getPayloadForEntry(entry: WorkflowEntry): WorkflowPayload {
  switch (entry) {
    case "upload":
      return MOCK_UPLOAD_PAYLOAD;
    case "target":
      return MOCK_TARGET_PAYLOAD;
    case "smiles":
    default:
      return MOCK_SMILES_PAYLOAD;
  }
}
