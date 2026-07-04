import type { Viewport } from "@/features/models/types";
import { create } from "zustand";


interface State {
  viewport: Viewport;
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  setViewport: (viewport: Viewport) => void;
  setSelectedBlockId: (id: string | null) => void;
  setHoveredBlockId: (id: string | null) => void;
}

export const useEditorStore = create<State>()((set) => ({
  viewport: "desktop",
  selectedBlockId: null,
  hoveredBlockId: null,
  setViewport: (viewport) => set({ viewport }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setHoveredBlockId: (id) => set({ hoveredBlockId: id }),
}));
