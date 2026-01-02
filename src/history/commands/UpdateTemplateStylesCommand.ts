import { produce } from "immer";
import { BaseCommand } from "@/history/commands/BaseCommand";
import type { TemplateEntity } from "@/entities/template";
import type { CommandType } from "../types";

interface UpdateTemplateStylesOptions {
  template: TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  styles: Record<string, any>;
  type: CommandType;
  userId?: string;
}

export class UpdateTemplateStylesCommand extends BaseCommand {
  private template: TemplateEntity | null;
  private setTemplate: (t: TemplateEntity) => void;
  private styles: Record<string, any>;

  constructor(options: UpdateTemplateStylesOptions) {
    super({ type: options.type, userId: options.userId });
    this.template = options.template;
    this.setTemplate = options.setTemplate;
    this.styles = options.styles;
  }

  execute() {
    if (!this.template) return;

    const newTemplate = produce(this.template, (draft) => {
      // Initialize styles if not exists
      if (!draft.styles) {
        draft.styles = {};
      }

      // Store previous state
      const previousStyles = { ...draft.styles };

      // Update styles
      Object.assign(draft.styles, this.styles);

      // Store changes in metadata
      this.metadata.changes = [
        {
          previousValue: previousStyles,
          newValue: { ...draft.styles },
        },
      ];
    });

    this.setTemplate(newTemplate);
  }

  undo() {
    if (!this.template || !this.metadata.changes[0]) return;

    const newTemplate = produce(this.template, (draft) => {
      draft.styles = this.metadata.changes[0].previousValue;
    });

    this.setTemplate(newTemplate);
  }
}
