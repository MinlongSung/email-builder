import { create } from "zustand";
import type { Command } from "@/history/types";
import { historyService } from "@/history/services/historyService";

interface HistoryStore {
  timeline: Command[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  execute: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  goTo: (index: number) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => {
  // Suscribirse a cambios del service
  historyService.subscribe(() => {
    set({
      timeline: historyService.getTimeline(),
      currentIndex: historyService.getIndex(),
      canUndo: historyService.canUndo(),
      canRedo: historyService.canRedo(),
    });
  });

  return {
    timeline: [],
    currentIndex: -1,
    canUndo: false,
    canRedo: false,

    execute: (command: Command) => historyService.executeCommand(command),
    undo: () => historyService.undo(),
    redo: () => historyService.redo(),
    goTo: (index: number) => historyService.goTo(index),
    clear: () => historyService.clear(),
  };
});
