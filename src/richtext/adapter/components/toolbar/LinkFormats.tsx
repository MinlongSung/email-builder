import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const LinkFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        style={{ backgroundColor: editorState?.isLink ? "red" : "" }}
        title="Insert Link"
      >
        LINK
      </button>

      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        title="Remove Link"
        disabled={editorState?.isLink}
      >
        UNLINK
      </button>
    </div>
  );
};
