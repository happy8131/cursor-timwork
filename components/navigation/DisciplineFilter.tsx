"use client";

import { useViewerStore } from "@/lib/store";
import { getDisciplineNames, getRegionNames, getDiscipline } from "@/lib/metadata";
import {
  Ruler,
  Flame,
  Droplets,
  Wind,
  TreePine,
  Wrench,
  HardHat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DISCIPLINE_ICONS: Record<string, LucideIcon> = {
  건축: HardHat,
  구조: Ruler,
  소방: Flame,
  배관설비: Droplets,
  공조설비: Wind,
  설비: Wrench,
  조경: TreePine,
};

const DISCIPLINE_COLORS: Record<string, string> = {
  건축: "bg-blue-50 text-blue-700 border-blue-200",
  구조: "bg-red-50 text-red-700 border-red-200",
  소방: "bg-orange-50 text-orange-700 border-orange-200",
  배관설비: "bg-cyan-50 text-cyan-700 border-cyan-200",
  공조설비: "bg-teal-50 text-teal-700 border-teal-200",
  설비: "bg-purple-50 text-purple-700 border-purple-200",
  조경: "bg-green-50 text-green-700 border-green-200",
};

export default function DisciplineFilter() {
  const {
    selectedDrawingId,
    selectedDiscipline,
    selectedRegion,
    selectDiscipline,
    selectRegion,
  } = useViewerStore();

  const disciplines = getDisciplineNames(selectedDrawingId);

  if (selectedDrawingId === "00" || disciplines.length === 0) {
    return (
      <div className="px-2 py-3 text-center text-xs text-neutral-400">
        건물을 선택하면 공종이 표시됩니다
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        공종
      </p>

      {disciplines.map((name) => {
        const isSelected = selectedDiscipline === name;
        const Icon = DISCIPLINE_ICONS[name] || Wrench;
        const colorClass =
          DISCIPLINE_COLORS[name] || "bg-neutral-50 text-neutral-700 border-neutral-200";
        const regions = getRegionNames(selectedDrawingId, name);
        const discipline = getDiscipline(selectedDrawingId, name);
        const revCount = discipline?.revisions?.length ?? 0;

        return (
          <div key={name}>
            <button
              onClick={() =>
                selectDiscipline(isSelected ? null : name)
              }
              className={`flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-sm transition-colors ${
                isSelected ? colorClass : "border-transparent text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{name}</span>
              {revCount > 0 && (
                <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                  {revCount}
                </span>
              )}
            </button>

            {/* Region 선택 (구조 공종의 A/B 영역 등) */}
            {isSelected && regions.length > 0 && (
              <div className="ml-6 mt-1 flex flex-col gap-0.5">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() =>
                      selectRegion(selectedRegion === region ? null : region)
                    }
                    className={`rounded-md px-2 py-1 text-left text-xs transition-colors ${
                      selectedRegion === region
                        ? "bg-neutral-200 font-medium text-neutral-800"
                        : "text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    Region {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
