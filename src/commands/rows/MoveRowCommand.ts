import type { TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface MoveRowOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  oldIndex: number;
  newIndex: number;
}

export class MoveRowCommand extends Command {
  constructor(private options: MoveRowOptions) {
    super();
  }

  execute() {
    const { getTemplate, setTemplate, oldIndex, newIndex } = this.options;
    const template = getTemplate();
    if (!template) return;

    // Copia inmutable de filas
    const newRows = [...template.rows];
    const [row] = newRows.splice(oldIndex, 1);
    newRows.splice(newIndex, 0, row);

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, oldIndex, newIndex } = this.options;
    const template = getTemplate();
    if (!template) return;

    // Copia inmutable de filas
    const newRows = [...template.rows];
    const [row] = newRows.splice(newIndex, 1);
    newRows.splice(oldIndex, 0, row);

    setTemplate({ ...template, rows: newRows });
  }
}
