export interface TemplateEntity {
  root: RootEntity;
}

export type NodeEntity = StructureEntity | BlockEntity;
export type StructureEntity = RootEntity | RowEntity | ColumnEntity;
export type BlockEntity = TextBlockEntity | ButtonBlockEntity;

export type NodeType = RootType | RowType | ColumnType | BlockType;
export type RootType = "root";
export type RowType = "row";
export type ColumnType = "column";
export type BlockType = "text" | "button";

export interface BaseNodeEntity {
  id: string;
  type: NodeType;
  style?: Record<string, string | number>;
}

export interface RootEntity extends BaseNodeEntity {
  type: "root";
  width: number;
  rows: RowEntity[]
}

export interface RowEntity extends BaseNodeEntity {
  type: "row";
  separatorSize: number;
  isResponsive: boolean;
  columns: ColumnEntity[];
}

export interface ColumnEntity extends BaseNodeEntity {
  type: "column";
  width: number;
  blocks: BlockEntity[];
}

export interface TextBlockEntity extends BaseNodeEntity {
  type: "text";
  content: TextContent;
}

export interface ButtonBlockEntity extends BaseNodeEntity {
  type: "button";
  content: TextContent;
}

export interface TextContent {
  html: string;
  json: Record<string, unknown>;
}

export const BLOCK_TYPES: BlockType[] = ["text", "button"];
export const ROW_TYPES: RowType[] = ["row"];
export const COLUMN_TYPES: ColumnType[] = ["column"];

export interface ColumnCoordinates {
  rowIndex: number;
  columnIndex: number;
};

export interface BlockCoordinates extends ColumnCoordinates {
  blockIndex: number;
};
