import { create } from "zustand";

export type ViewMode = "desktop" | "mobile";

interface EditorUIState {
  selectedId: string | null;
  hoveredId: string | null;
  viewMode: ViewMode;

  setSelectedId: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useUIStore = create<EditorUIState>((set) => ({
  selectedId: null,
  hoveredId: null,
  viewMode: "desktop",

  setSelectedId: (id) => set({ selectedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
