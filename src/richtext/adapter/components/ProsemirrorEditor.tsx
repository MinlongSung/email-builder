import { useLayoutEffect, useRef } from "react";
import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import type { EditorContent } from "@/richtext/core/types";
import { Editor } from "@/richtext/core/Editor";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { buildExtensions } from "@/richtext/adapter/utils/buildExtensions";

interface ProsemirrorEditorProps {
  content: EditorContent;
  onUpdate: (editor: Editor) => void;
}

export const ProsemirrorEditor = ({
  content,
  onUpdate,
}: ProsemirrorEditorProps) => {
  const { setActiveEditor, selectionCoordenates } = useProsemirror();
  const template = useCanvasStore((store) => store.template);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  useLayoutEffect(() => {
    if (!mountRef.current || !template) return; 

    const editor = new Editor({
      domElement: mountRef.current,
      extensions: buildExtensions(template.settings),
      content,
      onUpdate: ({ editor }) => onUpdate(editor),
    });

    editorRef.current = editor;

    editor.commands.setContent(content);
    const { start, end } = selectionCoordenates.current;
    const from = editor.view.posAtCoords({ left: start.x, top: start.y })?.pos;
    const to = editor.view.posAtCoords({ left: end.x, top: end.y })?.pos;
    if (from && to) editor.commands.setTextSelection({ from, to });
    editor.commands.focus();

    setActiveEditor(editor);

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} />;
};
