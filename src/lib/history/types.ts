import type { HistoryEntry } from "./HistoryEntry";

export interface CommandMetadata {
  id: string;
  timestamp: number;
  type: CommandType;
  userId?: string;
}

export type CommandType =
  | "row.add"
  | "row.delete"
  | "row.move"
  | "row.clone"
  | "row.update"
  | "block.add"
  | "block.delete"
  | "block.move"
  | "block.clone"
  | "block.update"
  | "root.update.width"
  | "root.update.backgroundColor"
  | "root.update.backgroundImage"
  | "template.global.styles"
  | "template.global.button.styles";


export type Events = {
  execute: { entry: HistoryEntry };
  undo: { entry: HistoryEntry; index: number };
  redo: { entry: HistoryEntry; index: number };
  goto: { from: number; to: number };
  change: { currentIndex: number; canUndo: boolean; canRedo: boolean };
};

export type Listener<T> = (payload: T) => void;