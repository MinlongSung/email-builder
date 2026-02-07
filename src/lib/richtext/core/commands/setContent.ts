import type { RawCommands } from "../types";

export interface SetContentOptions {
  emitUpdate?: boolean
}

declare module "../types" {
  interface Commands<ReturnType> {
    setContent: {
      /**
       * Replace the entire document with new content.
       * @param content - HTML string or JSON object
       * @example editor.commands.setContent('<p>Hello</p>')
       * @example editor.commands.setContent({ type: 'doc', content: [...] })
       */
      setContent: (content: EditorContent, options?: SetContentOptions) => ReturnType;
    };
  }
}

export const setContent: RawCommands["setContent"] =
  (content, { emitUpdate = true } = {}) =>
    ({ editor, tr, dispatch }) => {
      if (dispatch) {
        const newNode = editor.parseContent(content);
        tr.setMeta('preventUpdate', !emitUpdate)
        tr.replaceWith(0, tr.doc.content.size, newNode.content);
        dispatch(tr);
      }

      return true;
    };
