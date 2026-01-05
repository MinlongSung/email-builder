import { Editor } from "@/richtext/core/Editor";
import { buildExtensions } from "./buildExtensions";
import type { TemplateEntity } from "@/entities/template";

let globalEditor: Editor | null = null;

export const getOrCreateGlobalEditor = (template: TemplateEntity) => {
  if (!globalEditor) {
    globalEditor = new Editor({
      domElement: document.createElement("div"),
      extensions: buildExtensions(template.settings),
      content: "",
    });
  }

  return globalEditor;
};

export const cleanupGlobalEditor = () => {
  globalEditor?.destroy();
  globalEditor = null;
};
