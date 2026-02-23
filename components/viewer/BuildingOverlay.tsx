"use client";

import { useViewerStore } from "@/lib/store";
import { getBuildingDrawings, getDrawing } from "@/lib/metadata";
import { useMemo } from "react";

export default function BuildingOverlay() {
  const { selectedDrawingId, selectDrawing } = useViewerStore();

  const buildings = useMemo(() => {
    if (selectedDrawingId !== "00") return [];
    return getBuildingDrawings().filter((b) => b.position?.vertices);
  }, [selectedDrawingId]);

  if (buildings.length === 0) return null;

  const allPoints = buildings.flatMap(
    (b) => b.position?.vertices ?? []
  );
  const minX = Math.min(...allPoints.map((p) => p[0]));
  const minY = Math.min(...allPoints.map((p) => p[1]));
  const maxX = Math.max(...allPoints.map((p) => p[0]));
  const maxY = Math.max(...allPoints.map((p) => p[1]));

  const padding = 200;
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      {buildings.map((building) => {
        const vertices = building.position?.vertices ?? [];
        if (vertices.length === 0) return null;

        const points = vertices.map((v) => `${v[0]},${v[1]}`).join(" ");

        const cx =
          vertices.reduce((sum, v) => sum + v[0], 0) / vertices.length;
        const cy =
          vertices.reduce((sum, v) => sum + v[1], 0) / vertices.length;

        return (
          <g key={building.id} className="pointer-events-auto cursor-pointer">
            <polygon
              points={points}
              fill="rgba(245, 158, 11, 0.15)"
              stroke="rgba(245, 158, 11, 0.6)"
              strokeWidth="3"
              className="transition-all hover:fill-amber-400/30 hover:stroke-amber-500"
              onClick={() => selectDrawing(building.id)}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none fill-amber-800 text-[28px] font-bold"
            >
              {building.name.replace(" 지상1층 평면도", "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
