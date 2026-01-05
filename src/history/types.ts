export interface CommandMetadata {
  id: string        // Identificador único del entry
  timestamp: number // Momento de ejecución
  type: CommandType      // Tipo de comando (ej: 'insert-text', 'delete-line')
  userId?: string   // Usuario que ejecuta la acción
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
  | "template.global.styles";
