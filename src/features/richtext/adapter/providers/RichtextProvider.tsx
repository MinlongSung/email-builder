import { useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { useEditor } from "@tiptap/react";

import { RichtextContext } from "@/features/richtext/adapter/contexts/RichtextContext";
import { RICHTEXT_EXTENSIONS } from "@/features/richtext/adapter/presets";
import type { ButtonBlock, TextBlock } from "@/features/models/types";
import type { SetEditorProps } from "@/features/richtext/adapter/types";

interface Props {
  children: React.ReactNode;
}

export function RichtextProvider({ children }: Props) {
  const [activeBlock, setActiveBlock] = useState<
    TextBlock | ButtonBlock | null
  >(null);

  const editor = useEditor({
    extensions: RICHTEXT_EXTENSIONS,
    content: "",
    onUpdate: () => {},
    onBlur: () => {},
    enableCoreExtensions: {
      textDirection: false,
    },
  });

  const setEditor = ({ block, coordinates }: SetEditorProps) => {
    flushSync(() => setActiveBlock(block));
    editor.commands.setContent(block.props.content);
    const from = editor.view.posAtCoords({
      left: coordinates.start.x,
      top: coordinates.start.y,
    })?.pos;
    const to = editor.view.posAtCoords({
      left: coordinates.end.x,
      top: coordinates.end.y,
    })?.pos;
    if (from != null && to != null) {
      editor.commands.setTextSelection({ from, to });
    }
    editor.commands.focus();
  };

  const contextValue = useMemo(
    () => ({
      editor,
      activeBlock,
      setEditor,
    }),
    [editor, activeBlock, setEditor],
  );

  return (
    <RichtextContext.Provider value={contextValue}>
      {children}
    </RichtextContext.Provider>
  );
}
