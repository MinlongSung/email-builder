import type { RowEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface DeleteRowOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
}

export class DeleteRowCommand extends Command {
  private deletedRow: RowEntity | null = null;

  constructor(private options: DeleteRowOptions) {
    super();
  }

  execute() {
    const { getTemplate, setTemplate, rowIndex } = this.options;
    const template = getTemplate();
    if (!template) return;

    // Guardar fila eliminada
    this.deletedRow = template.rows[rowIndex];

    // Copia inmutable de filas
    const newRows = [...template.rows];
    newRows.splice(rowIndex, 1);

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, rowIndex } = this.options;
    const template = getTemplate();
    if (!template || !this.deletedRow) return;

    // Restaurar snapshot previo
    const newRows = [...template.rows];
    newRows.splice(rowIndex, 0, this.deletedRow);

    setTemplate({ ...template, rows: newRows });
  }
}
