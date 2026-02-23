"use client";

import { useViewerStore } from "@/lib/store";
import {
  getRootDrawing,
  getBuildingDrawings,
  getDisciplineNames,
} from "@/lib/metadata";
import { Building2, Map, ChevronRight } from "lucide-react";

export default function BuildingTree() {
  const { selectedDrawingId, selectDrawing } = useViewerStore();
  const root = getRootDrawing();
  const buildings = getBuildingDrawings();

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        건물
      </p>

      {/* 전체 배치도 */}
      <button
        onClick={() => selectDrawing(root.id)}
        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
          selectedDrawingId === root.id
            ? "bg-amber-50 font-medium text-amber-700"
            : "text-neutral-600 hover:bg-neutral-50"
        }`}
      >
        <Map className="h-4 w-4 shrink-0" />
        <span className="truncate">{root.name}</span>
      </button>

      {/* 건물 목록 */}
      {buildings.map((building) => {
        const isSelected = selectedDrawingId === building.id;
        const disciplineCount = getDisciplineNames(building.id).length;

        return (
          <button
            key={building.id}
            onClick={() => selectDrawing(building.id)}
            title={building.name}
            className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
              isSelected
                ? "bg-amber-50 font-medium text-amber-700"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{building.name}</span>
            <span className="text-xs text-neutral-400">
              {disciplineCount}개 공종
            </span>
            <ChevronRight className="h-3 w-3 shrink-0 text-neutral-300" />
          </button>
        );
      })}
    </div>
  );
}
