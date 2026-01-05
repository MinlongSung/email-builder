import type { RowEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface CloneRowOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  generateId: () => string; // pasamos la función
}

export class CloneRowCommand extends Command {
  private clonedRow: RowEntity | null = null;
  private previousRows: RowEntity[] = [];

  constructor(private options: CloneRowOptions) {
    super();
  }

  execute() {
    const { getTemplate, setTemplate, rowIndex, generateId } = this.options;
    const template = getTemplate();
    if (!template) return;

    this.previousRows = [...template.rows];
    const row = template.rows[rowIndex];
    if (!row) return;

    const clonedRow: RowEntity = {
      ...row,
      id: generateId(),
      columns: row.columns.map((col) => ({
        ...col,
        id: generateId(),
        blocks: col.blocks.map((block) => ({ ...block, id: generateId() })),
      })),
    };

    this.clonedRow = clonedRow;

    const newRows = [...template.rows];
    newRows.splice(rowIndex + 1, 0, clonedRow);

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate } = this.options;
    const template = getTemplate();
    if (!template || !this.clonedRow) return;

    setTemplate({ ...template, rows: this.previousRows });
  }
}
