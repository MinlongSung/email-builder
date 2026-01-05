import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const BasicTextStyleFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        marks: {
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          strike: editor.isActive("strike"),
          underline: editor.isActive("underline"),
        },
      };
    },
  });

  if (!editor || !editorState) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={{ backgroundColor: editorState?.marks.bold ? "red" : "" }}
        title="Bold (Ctrl+B)"
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{ backgroundColor: editorState?.marks.italic ? "red" : "" }}
        title="Italic (Ctrl+I)"
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        style={{ backgroundColor: editorState?.marks.underline ? "red" : "" }}
        title="Underline (Ctrl+U)"
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={{ backgroundColor: editorState?.marks.strike ? "red" : "" }}
        title="Strikethrough"
      >
        S
      </button>
    </div>
  );
};
