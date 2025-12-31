export interface CommandMetadata {
  id: string;
  userId?: string;
  timestamp: number;
  type: CommandType;
}

export interface Command {
  execute(): void;
  undo(): void;
  metadata: CommandMetadata;
}

export type CommandType =
  | "row.add"
  | "row.delete"
  | "row.move"
  | "row.clone"
  | "block.add"
  | "block.delete"
  | "block.move"
  | "block.clone"
  | "block.update";
