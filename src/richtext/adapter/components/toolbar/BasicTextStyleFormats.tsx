import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const BasicTextStyleFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
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
