import { useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { useEditor } from "@tiptap/react";

import { RichtextContext } from "@/features/richtext/adapter/contexts/RichtextContext";
import { RICHTEXT_EXTENSIONS } from "@/features/richtext/adapter/presets";
import type { MountEditorProps } from "@/features/richtext/adapter/types";

interface Props {
  children: React.ReactNode;
}

export function RichtextProvider({ children }: Props) {
  const [editorId, setEditorId] = useState<string>("");

  const editor = useEditor({
    extensions: RICHTEXT_EXTENSIONS,
    content: "",
    onUpdate: () => {},
    onBlur: () => {},
    enableCoreExtensions: {
      textDirection: false,
    },
  });

  const mountEditor = ({
    editorId,
    content,
    coordinates,
  }: MountEditorProps) => {
    flushSync(() => setEditorId(editorId));
    editor.commands.setContent(content);
    const { start, end } = coordinates;
    const from = editor.view.posAtCoords({ left: start.x, top: start.y })?.pos;
    const to = editor.view.posAtCoords({ left: end.x, top: end.y })?.pos;
    if (from != null && to != null) {
      editor.commands.setTextSelection({ from, to });
    }
    editor.commands.focus();
  };

  const contextValue = useMemo(
    () => ({
      editor,
      editorId,
      mountEditor,
    }),
    [editor, editorId, mountEditor],
  );

  return (
    <RichtextContext.Provider value={contextValue}>
      {children}
    </RichtextContext.Provider>
  );
}
