import { create } from "zustand";
import type { Command } from "@/features/document/core/commands/Command";
import type { BlockType } from "@/features/models/types";

const MAX_HISTORY = 200;

export type CommandAction = "add" | "update" | "delete" | "move" | "duplicate";

export interface CommandTarget {
  id: string;
  type: BlockType;
}

export interface CommandActor {
  id: string;
  name?: string;
}

export interface CommandMetadata {
  entryId: string;
  label?: string;

  action: CommandAction;
  targets: CommandTarget[];

  actor?: CommandActor;

  timestamp: number;
}

export interface HistoryEntry {
  command: Command;
  metadata: CommandMetadata;
}

interface HistoryState {
  timeline: HistoryEntry[];
  currentIndex: number;

  canUndo: boolean;
  canRedo: boolean;

  push(entry: HistoryEntry): void;

  undo(): HistoryEntry | null;
  redo(): HistoryEntry | null;

  setCurrentIndex(index: number): void;
  goTo(index: number): HistoryEntry[];
}

const getHistoryFlags = (currentIndex: number, timelineLength: number) => ({
  canUndo: currentIndex >= 0,
  canRedo: currentIndex < timelineLength - 1,
});

export const useHistoryStore = create<HistoryState>((set, get) => ({
  timeline: [],
  currentIndex: -1,

  canUndo: false,
  canRedo: false,

  push(entry) {
    set(({ timeline, currentIndex }) => {
      const nextTimeline = [
        ...timeline.slice(0, currentIndex + 1),
        entry,
      ].slice(-MAX_HISTORY);

      const nextIndex = nextTimeline.length - 1;

      return {
        timeline: nextTimeline,
        currentIndex: nextIndex,
        ...getHistoryFlags(nextIndex, nextTimeline.length),
      };
    });
  },

  undo() {
    const { timeline, currentIndex } = get();

    if (currentIndex < 0) {
      return null;
    }

    const entry = timeline[currentIndex];
    const nextIndex = currentIndex - 1;

    set({
      currentIndex: nextIndex,
      ...getHistoryFlags(nextIndex, timeline.length),
    });

    return entry;
  },

  redo() {
    const { timeline, currentIndex } = get();

    if (currentIndex >= timeline.length - 1) {
      return null;
    }

    const nextIndex = currentIndex + 1;
    const entry = timeline[nextIndex];

    set({
      currentIndex: nextIndex,
      ...getHistoryFlags(nextIndex, timeline.length),
    });

    return entry;
  },

  setCurrentIndex(index) {
    const { timeline } = get();

    if (index < -1 || index >= timeline.length) {
      return;
    }

    set({
      currentIndex: index,
      ...getHistoryFlags(index, timeline.length),
    });
  },

  goTo(index) {
    const { timeline, currentIndex } = get();

    if (index === currentIndex) {
      return [];
    }

    if (index < -1 || index >= timeline.length) {
      return [];
    }

    const entries: HistoryEntry[] = [];

    if (index < currentIndex) {
      while (get().currentIndex > index) {
        const entry = get().undo();

        if (entry) {
          entries.push(entry);
        }
      }
    } else {
      while (get().currentIndex < index) {
        const entry = get().redo();

        if (entry) {
          entries.push(entry);
        }
      }
    }

    return entries;
  },
}));
