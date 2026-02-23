"use client";

import { useEffect } from "react";
import { useViewerStore } from "@/lib/store";

export default function KeyboardShortcuts() {
  const { toggleSidebar } = useViewerStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        const searchBtn = document.querySelector(
          '[data-search-trigger]'
        ) as HTMLButtonElement | null;
        searchBtn?.click();
      }

      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleSidebar();
      }

      if (e.key === "Escape") {
        const activeEl = document.activeElement as HTMLElement;
        activeEl?.blur();
      }
    }

    function isInputFocused() {
      const el = document.activeElement;
      return (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return null;
}
