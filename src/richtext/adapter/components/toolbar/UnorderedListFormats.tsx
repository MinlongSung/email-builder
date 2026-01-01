import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const UnorderedListFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().toggleBulletList("disc").run()}
        style={{ backgroundColor: editorState?.bulletList.disc ? "red" : "" }}
        title="Bullet List - Disc"
      >
        DISC LIST
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList("circle").run()}
        style={{
          backgroundColor: editorState?.bulletList.circle ? "red" : "",
        }}
        title="Bullet List - Circle"
      >
        CIRCLE LIST
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList("square").run()}
        style={{
          backgroundColor: editorState?.bulletList.square ? "red" : "",
        }}
        title="Bullet List - Square"
      >
        SQUARE LIST
      </button>
    </div>
  );
};
