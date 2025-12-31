import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { BlockEntity, TemplateEntity } from "@/entities/template";

interface AddBlockCommandOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  block: BlockEntity;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  type: CommandType;
  userId?: string;
}

export class AddBlockCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private block: BlockEntity;
  private rowIndex: number;
  private columnIndex: number;
  private blockIndex: number;

  constructor(options: AddBlockCommandOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.block = options.block;
    this.rowIndex = options.rowIndex;
    this.columnIndex = options.columnIndex;
    this.blockIndex = options.blockIndex;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const column = draft.rows[this.rowIndex].columns[this.columnIndex];
      column.blocks.splice(this.blockIndex, 0, this.block);
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const column = draft.rows[this.rowIndex].columns[this.columnIndex];
      column.blocks = column.blocks.filter((b) => b.id !== this.block.id);
    });

    this.setTemplate(newTemplate);
  }
}
