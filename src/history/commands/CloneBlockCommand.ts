import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { BlockEntity, TemplateEntity } from "@/entities/template";
import { generateId } from "@/utils/generateId";

interface CloneBlockOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  type: CommandType;
  userId?: string;
}

export class CloneBlockCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private rowIndex: number;
  private columnIndex: number;
  private blockIndex: number;
  private clonedBlockId: string | null = null;

  constructor(options: CloneBlockOptions) {
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
      const block =
        draft.rows[this.rowIndex].columns[this.columnIndex].blocks[
          this.blockIndex
        ];
      const clonedBlock: BlockEntity = { ...block, id: generateId() };
      this.clonedBlockId = clonedBlock.id;

      draft.rows[this.rowIndex].columns[this.columnIndex].blocks.splice(
        this.blockIndex + 1,
        0,
        clonedBlock
      );
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.clonedBlockId || !this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const blocks =
        draft.rows[this.rowIndex].columns[this.columnIndex].blocks;
      const index = blocks.findIndex((b) => b.id === this.clonedBlockId);
      if (index >= 0) blocks.splice(index, 1);
    });

    this.setTemplate(newTemplate);
  }
}
