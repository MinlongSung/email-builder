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

      // Store previous state
      const previousBlock = produce(block, () => {});

      // Apply updates
      Object.assign(block, this.updates);

      this.metadata.changes = [
        {
          previousValue: previousBlock,
          newValue: { ...block },
        },
      ];
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template || !this.metadata.changes[0]) return;

    const previousBlock = this.metadata.changes[0].previousValue;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows[this.rowIndex].columns[this.columnIndex].blocks[
        this.blockIndex
      ] = previousBlock;
    });

    this.setTemplate(newTemplate);
  }
}
