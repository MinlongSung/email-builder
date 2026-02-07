import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const ScriptFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        marks: {
          subscript: editor.isActive("subscript"),
          superscript: editor.isActive("superscript"),
        },
      };
    },
  });

  if (!editor || !editorState) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        style={{
          backgroundColor: editorState?.marks.superscript ? "red" : "",
        }}
        title="Superscript"
      >
        Super
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        style={{ backgroundColor: editorState?.marks.subscript ? "red" : "" }}
        title="Subscript"
      >
        Sub
      </button>
    </div>
  );
};
