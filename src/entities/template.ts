/**
 * Template Metadata
 */
export interface TemplateMetadata {
  createdBy: string;
  createdAt: string;
  language?: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * Template - Entidad principal del email
 */
export interface TemplateEntity {
  id: string;
  name: string;
  metadata: TemplateMetadata;
  rows: RowEntity[];
}

/**
 * Row - Sección horizontal del template
 */
export type RowType = "row";

export interface RowEntity {
  id: string;
  type: RowType;
  style?: React.CSSProperties;
  separatorSize: number;
  isResponsive: boolean;
  columns: ColumnEntity[];
}

/**
 * Column - Columna dentro de una Row
 */
export interface ColumnEntity {
  id: string;
  width: number;
  style?: React.CSSProperties;
  blocks: BlockEntity[];
}

/**
 * Block Types - Tipos de bloques disponibles
 */
export type BlockType = "text" | "button";

/**
 * Base Block - Propiedades comunes de todos los bloques
 */
export interface BaseBlockEntity {
  id: string;
  type: BlockType;
}

/**
 * Text Content - Contenido de texto (ProseMirror)
 */
export interface TextContent {
  html: string;
  json: Record<string, unknown>;
}

/**
 * Text Block - Bloque de texto
 */
export interface TextBlockEntity extends BaseBlockEntity {
  type: "text";
  content: TextContent;
  style?: React.CSSProperties;
}

/**
 * Button Block - Bloque de botón
 */
export interface ButtonBlockEntity extends BaseBlockEntity {
  type: "button";
  content: TextContent;
  style?: React.CSSProperties;
}

/**
 * Block - Union de todos los tipos de bloques
 */
export type BlockEntity = TextBlockEntity | ButtonBlockEntity;

/**
 * Constants
 */
export const BLOCK_TYPES: BlockType[] = ["text", "button"];
export const ROW_TYPES: RowType[] = ["row"];
