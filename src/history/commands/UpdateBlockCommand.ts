import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { BlockEntity, TemplateEntity } from "@/entities/template";

interface UpdateBlockOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  updates: Partial<BlockEntity>;
  type: CommandType;
  userId?: string;
}

export class UpdateBlockCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private rowIndex: number;
  private columnIndex: number;
  private blockIndex: number;
  private updates: Partial<BlockEntity>;
  private previous: BlockEntity | null = null;

  constructor(options: UpdateBlockOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.rowIndex = options.rowIndex;
    this.columnIndex = options.columnIndex;
    this.blockIndex = options.blockIndex;
    this.updates = options.updates;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const block =
        draft.rows[this.rowIndex].columns[this.columnIndex].blocks[
          this.blockIndex
        ];

      // Guardar estado anterior usando Immer
      this.previous = produce(block, () => {});

      Object.assign(block, this.updates);
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.previous || !this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows[this.rowIndex].columns[this.columnIndex].blocks[
        this.blockIndex
      ] = this.previous!;
    });

    this.setTemplate(newTemplate);
  }
}
