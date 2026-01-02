import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { TemplateEntity } from "@/entities/template";

interface MoveBlockOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  fromRow: number;
  fromCol: number;
  fromBlock: number;
  toRow: number;
  toCol: number;
  toBlock: number;
  type: CommandType;
  userId?: string;
}

export class MoveBlockCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private fromRow: number;
  private fromCol: number;
  private fromBlock: number;
  private toRow: number;
  private toCol: number;
  private toBlock: number;

  constructor(options: MoveBlockOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.fromRow = options.fromRow;
    this.fromCol = options.fromCol;
    this.fromBlock = options.fromBlock;
    this.toRow = options.toRow;
    this.toCol = options.toCol;
    this.toBlock = options.toBlock;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const blocksFrom = draft.rows[this.fromRow].columns[this.fromCol].blocks;
      const [block] = blocksFrom.splice(this.fromBlock, 1);
      const blocksTo = draft.rows[this.toRow].columns[this.toCol].blocks;
      blocksTo.splice(this.toBlock, 0, block);

      this.metadata.changes = [
        {
          previousValue: {
            row: this.fromRow,
            col: this.fromCol,
            block: this.fromBlock,
          },
          newValue: {
            row: this.toRow,
            col: this.toCol,
            block: this.toBlock,
          },
        },
      ];
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template || !this.metadata.changes[0]) return;

    const from = this.metadata.changes[0].previousValue;
    const to = this.metadata.changes[0].newValue;

    const newTemplate = produce(this.template, (draft) => {
      const blocksTo = draft.rows[to.row].columns[to.col].blocks;
      const [block] = blocksTo.splice(to.block, 1);
      const blocksFrom = draft.rows[from.row].columns[from.col].blocks;
      blocksFrom.splice(from.block, 0, block);
    });

    this.setTemplate(newTemplate);
  }
}
