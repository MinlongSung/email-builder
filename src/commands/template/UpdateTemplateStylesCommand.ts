import type { TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface UpdateTemplateStylesOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  styles: Record<string, any>;
}

export class UpdateTemplateStylesCommand extends Command {
  private previousStyles: Record<string, any> = {};

  constructor(private options: UpdateTemplateStylesOptions) {
    super();
  }

  execute() {
    const template = this.options.getTemplate();
    if (!template) return;

    // Guardar snapshot previo
    this.previousStyles = { ...template.styles };

    // Crear nueva plantilla con estilos actualizados
    const newTemplate: TemplateEntity = {
      ...template,
      styles: { ...template.styles, ...this.options.styles },
    };

    this.options.setTemplate(newTemplate);
  }

  undo() {
    const template = this.options.getTemplate();
    if (!template) return;

    const newTemplate: TemplateEntity = {
      ...template,
      styles: { ...this.previousStyles },
    };

    this.options.setTemplate(newTemplate);
  }
}
