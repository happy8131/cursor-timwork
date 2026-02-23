"use client";

import { useViewerStore } from "@/lib/store";
import { getRevisions, getRegionNames } from "@/lib/metadata";
import { Clock, FileText, ArrowRight } from "lucide-react";

export default function RevisionTimeline() {
  const {
    selectedDrawingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevisionVersion,
    selectRevision,
  } = useViewerStore();

  if (!selectedDiscipline) {
    return (
      <div className="px-2 py-3 text-center text-xs text-neutral-400">
        공종을 선택하면 리비전이 표시됩니다
      </div>
    );
  }

  const regions = getRegionNames(selectedDrawingId, selectedDiscipline);
  const hasRegions = regions.length > 0;

  if (hasRegions && !selectedRegion) {
    return (
      <div className="px-2 py-3 text-center text-xs text-neutral-400">
        Region을 선택하면 리비전이 표시됩니다
      </div>
    );
  }

  const revisions = getRevisions(
    selectedDrawingId,
    selectedDiscipline,
    selectedRegion ?? undefined
  );

  if (revisions.length === 0) {
    return (
      <div className="px-2 py-3 text-center text-xs text-neutral-400">
        리비전 정보가 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        리비전 이력
      </p>

      <div className="relative ml-4 border-l-2 border-neutral-200 pl-4">
        {revisions.map((rev, index) => {
          const isSelected = selectedRevisionVersion === rev.version;
          const isLatest = index === revisions.length - 1;

          return (
            <div key={rev.version} className="relative pb-4 last:pb-0">
              {/* 타임라인 점 */}
              <div
                className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 ${
                  isSelected
                    ? "border-amber-500 bg-amber-500"
                    : isLatest
                      ? "border-amber-400 bg-white"
                      : "border-neutral-300 bg-white"
                }`}
              />

              <button
                onClick={() =>
                  selectRevision(isSelected ? null : rev.version)
                }
                className={`w-full rounded-lg p-2 text-left transition-colors ${
                  isSelected
                    ? "bg-amber-50 ring-1 ring-amber-200"
                    : "hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-amber-700" : "text-neutral-700"
                    }`}
                  >
                    {rev.version}
                  </span>
                  {isLatest && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      최신
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3 w-3" />
                  {rev.date}
                </div>

                <p className="mt-1 text-xs text-neutral-500">
                  {rev.description}
                </p>

                {rev.changes.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {rev.changes.map((change, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1 text-xs text-neutral-500"
                      >
                        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-neutral-300" />
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
