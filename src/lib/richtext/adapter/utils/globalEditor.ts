import { Editor } from "@/richtext/core/Editor";
import { buildTextExtensions } from "@/richtext/adapter/utils/buildExtensions";

let globalEditor: Editor | null = null;

export const getOrCreateGlobalEditor = () => {
  if (!globalEditor) {
    globalEditor = new Editor({
      domElement: document.createElement("div"),
      extensions: buildTextExtensions(),
      content: "",
    });
  }

  return globalEditor;
};

export const cleanupGlobalEditor = () => {
  globalEditor?.destroy();
  globalEditor = null;
};
