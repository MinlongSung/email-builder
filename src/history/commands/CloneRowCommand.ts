import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { RowEntity, TemplateEntity } from "@/entities/template";
import { generateId } from "@/utils/generateId";

interface CloneRowOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  type: CommandType;
  userId?: string;
}

export class CloneRowCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private rowIndex: number;

  constructor(options: CloneRowOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.rowIndex = options.rowIndex;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const row = draft.rows[this.rowIndex];
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

      draft.rows.splice(this.rowIndex + 1, 0, clonedRow);

      this.metadata.changes = [
        {
          previousValue: undefined,
          newValue: clonedRow,
        },
      ];
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows.splice(this.rowIndex + 1, 1);
    });

    this.setTemplate(newTemplate);
  }
}
