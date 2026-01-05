import { create } from "zustand";
import { historyService } from "@/history/services/historyService";
import type { CommandEntry } from "../CommandEntry";

export const useHistoryStore = create((set) => {
  const update = () =>
    set({
      timeline: historyService.getTimeline(),
      index: historyService.getCurrentIndex(),
      canUndo: historyService.canUndo(),
      canRedo: historyService.canRedo(),
    });

  historyService.subscribe(update);

  return {
    timeline: historyService.getTimeline(),
    index: historyService.getCurrentIndex(),
    canUndo: historyService.canUndo(),
    canRedo: historyService.canRedo(),
    execute: (entry: CommandEntry) =>
      historyService.executeCommand(entry.command, entry.meta),
    undo: () => historyService.undo(),
    redo: () => historyService.redo(),
    goTo: (i: number) => historyService.goTo(i),
    clear: () => historyService.clear(),
  };
});
