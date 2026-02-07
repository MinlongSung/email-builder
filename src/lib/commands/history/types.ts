import type { CommandEntry } from "./CommandEntry";

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
  | "template.update.width"
  | "template.update.backgroundColor"
  | "template.update.backgroundImage"
  | "template.global.styles"
  | "template.global.button.styles";


export type Events = {
  execute: { entry: CommandEntry };
  undo: { entry: CommandEntry; index: number };
  redo: { entry: CommandEntry; index: number };
  goto: { from: number; to: number };
  change: { currentIndex: number; canUndo: boolean; canRedo: boolean };
};

export type Listener<T> = (payload: T) => void;