import type { TemplateEntity, TemplateSettings } from "@/entities/template";
import { Command } from "@/commands/Command";

interface UpdateTemplateSettingsOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  settings: TemplateSettings;
}

export class UpdateTemplateSettingsCommand extends Command {
  private previousSettings!: TemplateSettings;

  constructor(private options: UpdateTemplateSettingsOptions) {
    super();
  }

  execute() {
    const template = this.options.getTemplate();
    if (!template) return;

    // Guardar snapshot previo
    this.previousSettings = { ...template.settings };

    // Crear nueva plantilla con estilos actualizados
    const newTemplate: TemplateEntity = {
      ...template,
      settings: { ...template.settings, ...this.options.settings },
    };

    this.options.setTemplate(newTemplate);
  }

  undo() {
    const template = this.options.getTemplate();
    if (!template) return;

    const newTemplate: TemplateEntity = {
      ...template,
      settings: { ...this.previousSettings },
    };

    this.options.setTemplate(newTemplate);
  }
}
