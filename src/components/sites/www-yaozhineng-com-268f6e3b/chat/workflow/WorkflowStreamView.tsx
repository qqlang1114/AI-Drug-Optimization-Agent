"use client";

import { memo } from "react";
import { AdmetResultCard, InputMoleculeCard } from "./InputMoleculeCard";
import {
  CandidateMoleculesCard,
  LiteratureCards,
  OptimizationRoutesCard,
} from "./OptimizationRoutesCard";
import { PhasePreviewDock } from "./PhasePreviewDock";
import { QueueStatusCard } from "./QueueStatusCard";
import { SimilarMoleculesCard } from "./SimilarMoleculesCard";
import { ThinkingAccordion } from "./ThinkingAccordion";
import type { WorkflowUiState } from "./types";

type WorkflowStreamViewProps = {
  workflow: WorkflowUiState;
  onToggleThinking: () => void;
};

function WorkflowStreamViewImpl({
  workflow,
  onToggleThinking,
}: WorkflowStreamViewProps) {
  return (
    <div className="flex w-full flex-col items-stretch gap-4">
      {workflow.showIntake ? (
        <QueueStatusCard queueAhead={workflow.queueAhead} />
      ) : null}

      <ThinkingAccordion
        open={workflow.thinkingOpen}
        active={workflow.active}
        title={
          workflow.active ? "深度思考与分析中..." : "深度思考与分析已完成"
        }
        steps={workflow.steps}
        onToggle={onToggleThinking}
      />

      <SimilarMoleculesCard items={workflow.similar} />

      {workflow.inputMolecule ? (
        <>
          <InputMoleculeCard molecule={workflow.inputMolecule} />
          <AdmetResultCard categories={workflow.inputMolecule.admet} />
        </>
      ) : null}

      <LiteratureCards items={workflow.literature} />
      <OptimizationRoutesCard routes={workflow.routes} />
      <CandidateMoleculesCard items={workflow.candidates} />

      {workflow.summary ? (
        <div className="w-full max-w-[860px] rounded-2xl border border-[#dce6f8] bg-[#f5f8ff] px-4 py-3 text-[13px] leading-6 text-[#334155]">
          {workflow.summary}
        </div>
      ) : null}

      {workflow.showPhaseDock || workflow.active ? (
        <PhasePreviewDock
          label={workflow.stageLabel}
          elapsedSec={workflow.elapsedSec}
          counts={workflow.counts}
          active={workflow.active}
        />
      ) : null}
    </div>
  );
}

export const WorkflowStreamView = memo(WorkflowStreamViewImpl);
