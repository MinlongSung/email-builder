export type Level = 1 | 2 | 3 | 4 | 5 | 6;
export const levels: Level[] = [1, 2, 3, 4, 5, 6];

interface TypographyConfig {
  color: string;
  fontSize: string;
  fontFamily: string;
  letterSpacing: string;
  lineHeight: string;
}

interface LinkConfig {
  color: string;
  isUnderlined: boolean;
}

interface ButtonConfig {
  color: string;
  backgroundColor: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  textDecoration: string;
  padding: string;
  border: string;
  borderRadius: string;
}

export interface TemplateConfig {
  heading: {
    level: Partial<Record<Level, Partial<TypographyConfig>>>;
  }
  paragraph: Partial<TypographyConfig>;
  link: Partial<LinkConfig>;
  button: Partial<ButtonConfig>;
}

export interface TemplateEntity {
  root: RootEntity;
  config: Partial<TemplateConfig>;
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
