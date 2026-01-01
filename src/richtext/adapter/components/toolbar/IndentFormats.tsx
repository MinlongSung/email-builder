import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const IndentFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
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
