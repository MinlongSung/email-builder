import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { CommandType } from "@/history/types";
import type { TemplateEntity } from "@/entities/template";

interface MoveRowOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  oldIndex: number;
  newIndex: number;
  type: CommandType;
  userId?: string;
}

export class MoveRowCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private oldIndex: number;
  private newIndex: number;

  constructor(options: MoveRowOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.oldIndex = options.oldIndex;
    this.newIndex = options.newIndex;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      const [row] = draft.rows.splice(this.oldIndex, 1);
      draft.rows.splice(this.newIndex, 0, row);

      this.metadata.changes = [
        {
          previousValue: this.oldIndex,
          newValue: this.newIndex,
        },
      ];
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template || !this.metadata.changes[0]) return;

    const oldIndex = this.metadata.changes[0].previousValue;
    const newIndex = this.metadata.changes[0].newValue;

    const newTemplate = produce(this.template, (draft) => {
      const [row] = draft.rows.splice(newIndex, 1);
      draft.rows.splice(oldIndex, 0, row);
    });

    this.setTemplate(newTemplate);
  }
}
