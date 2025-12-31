import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { RowEntity, TemplateEntity } from "@/entities/template";

interface DeleteRowOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  type: CommandType;
  userId?: string;
}

export class DeleteRowCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private rowIndex: number;
  private deletedRow: RowEntity | null = null;

  constructor(options: DeleteRowOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.rowIndex = options.rowIndex;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      this.deletedRow = draft.rows[this.rowIndex];
      draft.rows.splice(this.rowIndex, 1);
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.deletedRow || !this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows.splice(this.rowIndex, 0, this.deletedRow!);
    });

    this.setTemplate(newTemplate);
  }
}
