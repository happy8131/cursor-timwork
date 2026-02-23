"use client";

import { useState } from "react";
import { useViewerStore } from "@/lib/store";
import {
  getDrawing,
  getDiscipline,
  getRevisions,
  getRegionNames,
} from "@/lib/metadata";
import {
  ChevronUp,
  ChevronDown,
  Calendar,
  FileText,
  GitBranch,
  Info,
} from "lucide-react";

export default function DrawingInfo() {
  const {
    selectedDrawingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevisionVersion,
  } = useViewerStore();

  const [expanded, setExpanded] = useState(true);

  const drawing = getDrawing(selectedDrawingId);
  if (!drawing) return null;

  const discipline = selectedDiscipline
    ? getDiscipline(selectedDrawingId, selectedDiscipline)
    : null;

  const regions = selectedDiscipline
    ? getRegionNames(selectedDrawingId, selectedDiscipline)
    : [];

  const revisions = selectedDiscipline
    ? getRevisions(
        selectedDrawingId,
        selectedDiscipline,
        selectedRegion ?? undefined
      ) ?? []
    : [];

  const currentRevision = selectedRevisionVersion
    ? revisions.find((r) => r.version === selectedRevisionVersion)
    : null;

  const hasInfo = selectedDiscipline || selectedDrawingId !== "00";

  if (!hasInfo) return null;

  return (
    <div className="shrink-0 border-t border-neutral-200 bg-white">
      {/* 토글 헤더 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-50"
      >
        <Info className="h-3.5 w-3.5" />
        <span>도면 정보</span>
        <div className="flex-1" />
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5" />
        )}
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-4 pb-3 md:grid-cols-4">
          {/* 도면명 */}
          <div>
            <p className="text-[10px] font-medium uppercase text-neutral-400">
              도면
            </p>
            <p className="text-sm text-neutral-700">{drawing.name}</p>
          </div>

          {/* 공종 */}
          {selectedDiscipline && (
            <div>
              <p className="text-[10px] font-medium uppercase text-neutral-400">
                공종
              </p>
              <p className="text-sm text-neutral-700">
                {selectedDiscipline}
                {selectedRegion && (
                  <span className="ml-1 text-neutral-400">
                    (Region {selectedRegion})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* 리비전 정보 */}
          {currentRevision && (
            <>
              <div>
                <p className="text-[10px] font-medium uppercase text-neutral-400">
                  리비전
                </p>
                <div className="flex items-center gap-1.5">
                  <GitBranch className="h-3.5 w-3.5 text-neutral-400" />
                  <p className="text-sm font-medium text-neutral-700">
                    {currentRevision.version}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase text-neutral-400">
                  발행일
                </p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  <p className="text-sm text-neutral-700">
                    {currentRevision.date}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* 변경사항 */}
          {currentRevision && currentRevision.changes.length > 0 && (
            <div className="col-span-2 md:col-span-4">
              <p className="text-[10px] font-medium uppercase text-neutral-400">
                변경사항
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {currentRevision.changes.map((change, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
                  >
                    <FileText className="h-3 w-3" />
                    {change}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 총 리비전 수 */}
          {selectedDiscipline && !currentRevision && revisions.length > 0 && (
            <div>
              <p className="text-[10px] font-medium uppercase text-neutral-400">
                리비전 수
              </p>
              <p className="text-sm text-neutral-700">{revisions.length}개</p>
            </div>
          )}

          {/* Region 수 */}
          {regions.length > 0 && (
            <div>
              <p className="text-[10px] font-medium uppercase text-neutral-400">
                영역
              </p>
              <p className="text-sm text-neutral-700">
                {regions.join(", ")} ({regions.length}개)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
