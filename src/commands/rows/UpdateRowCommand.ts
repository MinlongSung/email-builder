import type { Command } from "@/commands/Command";
import type { TemplateEntity, RowEntity } from "@/entities/template";

interface UpdateRowCommandParams {
  rowIndex: number;
  getTemplate: () => TemplateEntity | null;
  setTemplate: (template: TemplateEntity) => void;
  updates: Partial<RowEntity>;
}

export class UpdateRowCommand implements Command {
  private rowIndex: number;
  private getTemplate: () => TemplateEntity | null;
  private setTemplate: (template: TemplateEntity) => void;
  private updates: Partial<RowEntity>;
  private previousRow: RowEntity | null = null;

  constructor(params: UpdateRowCommandParams) {
    this.rowIndex = params.rowIndex;
    this.getTemplate = params.getTemplate;
    this.setTemplate = params.setTemplate;
    this.updates = params.updates;
  }

  execute(): void {
    const template = this.getTemplate();
    if (!template) return;

    const row = template.rows[this.rowIndex];
    if (!row) return;

    // Save previous state for undo
    this.previousRow = JSON.parse(JSON.stringify(row));

    // Apply updates
    const updatedRow = { ...row, ...this.updates };
    const newRows = [...template.rows];
    newRows[this.rowIndex] = updatedRow;

    this.setTemplate({
      ...template,
      rows: newRows,
    });
  }

  undo(): void {
    if (!this.previousRow) return;

    const template = this.getTemplate();
    if (!template) return;

    const newRows = [...template.rows];
    newRows[this.rowIndex] = this.previousRow;

    this.setTemplate({
      ...template,
      rows: newRows,
    });
  }
}
