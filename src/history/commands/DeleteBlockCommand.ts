import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { BlockEntity, TemplateEntity } from "@/entities/template";

interface DeleteBlockOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  type: CommandType;
  userId?: string;
}

export class DeleteBlockCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private rowIndex: number;
  private columnIndex: number;
  private blockIndex: number;
  private deletedBlock: BlockEntity | null = null;

  constructor(options: DeleteBlockOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.rowIndex = options.rowIndex;
    this.columnIndex = options.columnIndex;
    this.blockIndex = options.blockIndex;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const blocks =
        draft.rows[this.rowIndex].columns[this.columnIndex].blocks;
      this.deletedBlock = blocks[this.blockIndex];
      blocks.splice(this.blockIndex, 1);
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.deletedBlock || !this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows[this.rowIndex].columns[this.columnIndex].blocks.splice(
        this.blockIndex,
        0,
        this.deletedBlock!
      );
    });

    this.setTemplate(newTemplate);
  }
}
