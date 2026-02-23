"use client";

import { useViewerStore } from "@/lib/store";
import BuildingTree from "@/components/navigation/BuildingTree";
import DisciplineFilter from "@/components/navigation/DisciplineFilter";
import RevisionTimeline from "@/components/navigation/RevisionTimeline";
import { X } from "lucide-react";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useViewerStore();

  return (
    <>
      {/* 모바일 백드롭 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] shrink-0 border-r border-neutral-200 bg-white transition-transform duration-300 md:static md:z-auto md:h-auto md:translate-x-0 md:transition-all ${
          sidebarOpen
            ? "w-72 translate-x-0"
            : "w-0 -translate-x-full overflow-hidden md:translate-x-0"
        }`}
      >
        <div className="flex h-full w-72 flex-col overflow-y-auto">
          {/* 모바일 닫기 버튼 */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-3 md:hidden">
            <span className="text-sm font-semibold text-neutral-700">
              도면 탐색
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 건물 네비게이션 */}
          <div className="border-b border-neutral-100 p-3">
            <BuildingTree />
          </div>

          {/* 공종 필터 */}
          <div className="border-b border-neutral-100 p-3">
            <DisciplineFilter />
          </div>

          {/* 리비전 타임라인 */}
          <div className="flex-1 overflow-y-auto p-3">
            <RevisionTimeline />
          </div>
        </div>
      </aside>
    </>
  );
}
