"use client";

import { useState, useEffect, useRef } from "react";
import { useViewerStore } from "@/lib/store";
import { buildBreadcrumb, searchDrawings, metadata } from "@/lib/metadata";
import {
  ChevronRight,
  Search,
  X,
  Menu,
  FileText,
} from "lucide-react";

export default function Header() {
  const {
    selectedDrawingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevisionVersion,
    searchQuery,
    setSearchQuery,
    navigateTo,
    toggleSidebar,
  } = useViewerStore();

  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const breadcrumbs = buildBreadcrumb(
    selectedDrawingId,
    selectedDiscipline ?? undefined,
    selectedRegion ?? undefined,
    selectedRevisionVersion ?? undefined
  );

  const searchResults = searchQuery.trim()
    ? searchDrawings(searchQuery.trim())
    : [];

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4">
      {/* 사이드바 토글 */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* 프로젝트명 */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 text-xs font-bold text-white">
          C
        </div>
        <span className="hidden text-sm font-semibold text-neutral-800 sm:inline">
          {metadata.project.name}
        </span>
      </div>

      {/* 브레드크럼 */}
      <nav className="ml-2 hidden items-center gap-1 md:flex">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-neutral-300" />
            )}
            <button
              onClick={() =>
                navigateTo(
                  item.drawingId ?? selectedDrawingId,
                  item.disciplineName,
                  item.regionName,
                  item.revisionVersion
                )
              }
              className={`rounded-md px-1.5 py-0.5 text-xs transition-colors ${
                index === breadcrumbs.length - 1
                  ? "font-medium text-neutral-800"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              {item.label}
            </button>
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {/* 검색 */}
      <div className="relative">
        {showSearch ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도면, 공종, 리비전 검색..."
                className="w-64 rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-8 text-sm text-neutral-700 outline-none transition-colors focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="text-xs text-neutral-400 hover:text-neutral-600"
            >
              닫기
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-300 hover:text-neutral-600"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">검색</span>
            <kbd className="hidden rounded border border-neutral-200 px-1 py-0.5 text-[10px] font-mono text-neutral-300 sm:inline">
              /
            </kbd>
          </button>
        )}

        {/* 검색 결과 드롭다운 */}
        {showSearch && searchQuery.trim() && (
          <div className="absolute right-0 top-full z-50 mt-1 max-h-64 w-80 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
            {searchResults.length === 0 ? (
              <div className="p-3 text-center text-xs text-neutral-400">
                검색 결과가 없습니다
              </div>
            ) : (
              searchResults.slice(0, 10).map((result, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigateTo(
                      result.drawing.id,
                      result.discipline ?? null,
                      null,
                      result.revision?.version ?? null
                    );
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="flex w-full items-start gap-2 border-b border-neutral-100 px-3 py-2 text-left transition-colors last:border-0 hover:bg-neutral-50"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      {result.drawing.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {[
                        result.discipline,
                        result.revision?.version,
                        result.revision?.description,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
