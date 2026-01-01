import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const ScriptFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
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
