import { create } from "zustand";

interface ViewerState {
  selectedDrawingId: string;
  selectedDiscipline: string | null;
  selectedRegion: string | null;
  selectedRevisionVersion: string | null;
  sidebarOpen: boolean;
  searchQuery: string;

  selectDrawing: (drawingId: string) => void;
  selectDiscipline: (name: string | null) => void;
  selectRegion: (name: string | null) => void;
  selectRevision: (version: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  navigateTo: (
    drawingId: string,
    discipline?: string | null,
    region?: string | null,
    revision?: string | null
  ) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  selectedDrawingId: "00",
  selectedDiscipline: null,
  selectedRegion: null,
  selectedRevisionVersion: null,
  sidebarOpen: true,
  searchQuery: "",

  selectDrawing: (drawingId) =>
    set({
      selectedDrawingId: drawingId,
      selectedDiscipline: null,
      selectedRegion: null,
      selectedRevisionVersion: null,
    }),

  selectDiscipline: (name) =>
    set({
      selectedDiscipline: name,
      selectedRegion: null,
      selectedRevisionVersion: null,
    }),

  selectRegion: (name) =>
    set({
      selectedRegion: name,
      selectedRevisionVersion: null,
    }),

  selectRevision: (version) =>
    set({
      selectedRevisionVersion: version,
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  navigateTo: (drawingId, discipline, region, revision) =>
    set({
      selectedDrawingId: drawingId,
      selectedDiscipline: discipline ?? null,
      selectedRegion: region ?? null,
      selectedRevisionVersion: revision ?? null,
    }),
}));
