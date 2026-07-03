import { useCallback, useMemo } from "react";

import { useEditor, type EditorOptions, type JSONContent } from "@tiptap/react";

import { RichtextContext } from "@/features/richtext/adapter/contexts/RichtextContext";
import { RICHTEXT_EXTENSIONS } from "@/features/richtext/adapter/presets";
import type { StartEditionProps } from "@/features/richtext/adapter/types";

interface Props extends Partial<Pick<EditorOptions, "onUpdate" | "onBlur">> {
  children?: React.ReactNode;
}

export function RichtextProvider({ onUpdate, onBlur, children }: Props) {
  const editor = useEditor({
    extensions: RICHTEXT_EXTENSIONS,
    onUpdate,
    onBlur,
    enableCoreExtensions: {
      textDirection: false,
    },
  });

  const startEdition = useCallback(
    ({ content, coordinates }: StartEditionProps) => {
      editor.commands.setContent(content);
      const { start, end } = coordinates;
      const from = editor.view.posAtCoords({
        left: start.x,
        top: start.y,
      })?.pos;
      const to = editor.view.posAtCoords({ left: end.x, top: end.y })?.pos;
      if (from != null && to != null) {
        editor.commands.setTextSelection({ from, to });
      }
      editor.commands.focus();
    },
    [editor],
  );

  const syncContent = useCallback(
    (content: JSONContent) => {
      if (!editor || editor.isDestroyed) return;
      const current = JSON.stringify(editor.getJSON());
      const incoming = JSON.stringify(content);
      if (current !== incoming) {
        editor.commands.setContent(content ?? null, { emitUpdate: false });
      }
    },
    [editor],
  );

  const contextValue = useMemo(
    () => ({ editor, startEdition, syncContent }),
    [editor, startEdition, syncContent],
  );

  return (
    <RichtextContext.Provider value={contextValue}>
      {children}
    </RichtextContext.Provider>
  );
}
