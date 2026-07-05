import { create } from "zustand";
import type { Command } from "@/features/editor/commands/Command";

export type CommandType =
  | "content:add"
  | "content:remove"
  | "content:move"
  | "content:clone"
  | "content:update"
  | "row:add"
  | "row:remove"
  | "row:move"
  | "row:clone"
  | "row:update"
  | "column:add"
  | "column:remove"
  | "column:move"
  | "column:update"
  | "root:update"
  | "template:update";

export interface HistoryEntry {
  command: Command;
  type: CommandType;
  timestamp: number;
}

const MAX_HISTORY = 200;

interface HistoryState {
  timeline: HistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  execute: (command: Command, type: CommandType) => void;
  undo: () => void;
  redo: () => void;
  goTo: (index: number) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  timeline: [],
  currentIndex: -1,
  canUndo: false,
  canRedo: false,

  execute(command, type) {
    command.execute();
    set(({ timeline, currentIndex }) => {
      const entry: HistoryEntry = { command, type, timestamp: Date.now() };
      const newTimeline = [...timeline.slice(0, currentIndex + 1), entry].slice(
        -MAX_HISTORY,
      );
      const newIndex = newTimeline.length - 1;
      return {
        timeline: newTimeline,
        currentIndex: newIndex,
        canUndo: true,
        canRedo: false,
      };
    });
  },

  undo() {
    const { timeline, currentIndex } = get();
    if (currentIndex < 0) return;
    timeline[currentIndex].command.undo();
    const newIndex = currentIndex - 1;
    set({ currentIndex: newIndex, canUndo: newIndex >= 0, canRedo: true });
  },

  redo() {
    const { timeline, currentIndex } = get();
    if (currentIndex >= timeline.length - 1) return;
    const newIndex = currentIndex + 1;
    timeline[newIndex].command.execute();
    set({
      currentIndex: newIndex,
      canUndo: true,
      canRedo: newIndex < timeline.length - 1,
    });
  },

  goTo(index) {
    const { timeline, currentIndex } = get();
    if (index === currentIndex || index < -1 || index >= timeline.length)
      return;

    if (index < currentIndex) {
      for (let i = currentIndex; i > index; i--) timeline[i].command.undo();
    } else {
      for (let i = currentIndex + 1; i <= index; i++)
        timeline[i].command.execute();
    }

    set({
      currentIndex: index,
      canUndo: index >= 0,
      canRedo: index < timeline.length - 1,
    });
  },
}));
