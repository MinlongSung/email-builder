import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { RowEntity, TemplateEntity } from "@/entities/template";

interface AddRowOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  row: RowEntity;
  index: number;
  type: CommandType;
  userId?: string;
}

export class AddRowCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private row: RowEntity;
  private index: number;

  constructor(options: AddRowOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.row = options.row;
    this.index = options.index;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows.splice(this.index, 0, this.row);
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.rows.splice(this.index, 1);
    });

    this.setTemplate(newTemplate);
  }
}
