import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const IndentFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        canOutdent: editor.can().setIndentation?.(-15) ?? false,
      };
    },
  });

  if (!editor || !editorState) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().setIndentation(30).run()}
        title="Increase Indent (Cmd+])"
      >
        INDENT
      </button>
      <button
        onClick={() => editor.chain().focus().setIndentation(-15).run()}
        title="Decrease Indent (Cmd+[)"
        disabled={!editorState?.canOutdent}
      >
        OUTDENT
      </button>
    </div>
  );
};
