import type { TemplateEntity, TextContent } from "@/entities/template";
import type { Editor } from "@/richtext/core/Editor";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import type { NodeCallback, Predicate } from "@/richtext/core/extensions/types";

/**
 * Aplica estilos a un contenido directamente
 */
export const applyStylesToContent = ({
  content,
  editor,
  predicate,
  callback,
}: {
  content: TextContent;
  editor: Editor;
  predicate: Predicate;
  callback: NodeCallback;
}): TextContent | null => {
  try {
    editor.commands.setContent(content.json);

    const tr = editor.state.tr;
    traverseInRange({
      from: 0,
      to: editor.state.doc.content.size,
      state: editor.state,
      tr,
      predicate,
      callback,
      includeMarks: true,
    });

    editor.view.dispatch(tr);

    const html = editor.getHTML();
    const json = editor.getJSON();

    return { html, json };
  } catch (error) {
    console.error(`Error applying styles to content:`, error);
    return null;
  }
};

/**
 * Aplica estilos globales a un bloque existente en el template
 */
export const applyGlobalStyles = ({
  getTemplate,
  rowIndex,
  columnIndex,
  blockIndex,
  editor,
  predicate,
  callback,
}: {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  editor: Editor;
  predicate: Predicate;
  callback: NodeCallback;
}): TextContent | null => {
  const template = getTemplate();
  const block =
    template?.rows[rowIndex]?.columns[columnIndex]?.blocks[blockIndex];
  if (!block) return null;

  return applyStylesToContent({
    content: block.content,
    editor,
    predicate,
    callback,
  });
};
