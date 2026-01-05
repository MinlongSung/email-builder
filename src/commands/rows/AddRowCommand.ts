import type { RowEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface AddRowOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  sourceRow: RowEntity; // la fila que queremos agregar/clonar
  index: number; // posición donde insertarla
  generateId: () => string; // generador de IDs para row, columnas y bloques
}

export class AddRowCommand extends Command {
  private previousRows: RowEntity[] = [];
  private newRow: RowEntity | null = null;

  constructor(private options: AddRowOptions) {
    super();
  }

  execute() {
    const { getTemplate, setTemplate, sourceRow, index, generateId } =
      this.options;
    const template = getTemplate();
    if (!template) return;

    // Snapshot previo para undo
    this.previousRows = [...template.rows];

    // Clonar fila con nuevos IDs
    const clonedRow: RowEntity = {
      ...sourceRow,
      id: generateId(),
      columns: sourceRow.columns.map((col) => ({
        ...col,
        id: generateId(),
        blocks: col.blocks.map((block) => ({ ...block, id: generateId() })),
      })),
    };

    this.newRow = clonedRow;

    // Copia inmutable de filas
    const newRows = [...template.rows];
    newRows.splice(index, 0, clonedRow);

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate } = this.options;
    const template = getTemplate();
    if (!template || !this.newRow) return;

    // Restaurar snapshot previo
    setTemplate({ ...template, rows: this.previousRows });
  }
}
