export interface Change {
  previousValue: any;
  newValue: any;
}

export interface CommandMetadata {
  id: string;
  userId?: string;
  timestamp: number;
  type: CommandType;
  changes: Change[];
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
  | "block.update"
  | "template.update.width"
  | "template.update.backgroundColor"
  | "template.update.backgroundImage"
  | "batch.template.settings"
  | "batch.global.styles";
