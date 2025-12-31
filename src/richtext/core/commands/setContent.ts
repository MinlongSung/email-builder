import type { RawCommands } from "@/richtext/core/types";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    setContent: {
      /**
       * Replace the entire document with new content.
       * @param content - HTML string or JSON object
       * @example editor.commands.setContent('<p>Hello</p>')
       * @example editor.commands.setContent({ type: 'doc', content: [...] })
       */
      setContent: (content: EditorContent) => ReturnType;
    };
  }
}

export const setContent: RawCommands["setContent"] =
  (content) =>
  ({ editor, tr, dispatch }) => {
    if (dispatch) {
      const newNode = editor.parseContent(content);
      tr.replaceWith(0, tr.doc.content.size, newNode.content);
      dispatch(tr);
    }

    return true;
  };
