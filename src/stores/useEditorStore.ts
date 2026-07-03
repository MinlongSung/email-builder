import { create } from "zustand";

type ViewMode = "desktop" | "mobile";

interface State {
  viewMode: ViewMode;
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  setViewMode: (viewMode: ViewMode) => void;
  setSelectedBlockId: (id: string | null) => void;
  setHoveredBlockId: (id: string | null) => void;
}

export const useEditorStore = create<State>()((set) => ({
  viewMode: "desktop",
  selectedBlockId: null,
  hoveredBlockId: null,
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setHoveredBlockId: (id) => set({ hoveredBlockId: id }),
}));
