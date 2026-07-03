import { useEffect, useMemo, useRef } from "react";
import { generateHTML } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";

import { useRichtext } from "@/features/richtext/adapter/hooks/useRichtext";
import type { SelectionCoordinates } from "@/features/richtext/adapter/types";
import type { ButtonBlock, TextBlock } from "@/features/models/types";
import { RICHTEXT_EXTENSIONS } from "@/features/richtext/adapter/presets";

interface Props extends React.ComponentProps<"div"> {
  block: TextBlock | ButtonBlock;
}

export const RichtextEditor = ({ block }: Props) => {
  const { editor, activeBlock, setEditor } = useRichtext();

  const selectionCoordinatesRef = useRef<SelectionCoordinates>({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  });

  const handleSelectionStart = (e: React.PointerEvent) => {
    selectionCoordinatesRef.current.start = { x: e.clientX, y: e.clientY };
  };

  const handleSelectionEnd = (e: React.PointerEvent) => {
    selectionCoordinatesRef.current.end = { x: e.clientX, y: e.clientY };
    setEditor({ block, coordinates: selectionCoordinatesRef.current });
  };

  const html = useMemo(
    () => generateHTML(block.props.content, RICHTEXT_EXTENSIONS),
    [block],
  );

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(block.props.content);
    if (current !== incoming) {
      editor.commands.setContent(block.props.content ?? null, {
        emitUpdate: false,
      });
    }
  }, [block, editor]);

  if (activeBlock?.id === block.id) return <EditorContent editor={editor} />;

  return (
    <span
      className="tiptap"
      onPointerDown={handleSelectionStart}
      onPointerUp={handleSelectionEnd}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
