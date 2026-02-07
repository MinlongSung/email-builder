import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const UnorderedListFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        bulletList: {
          disc: editor.isActive("bulletList", { listStyleType: "disc" }),
          circle: editor.isActive("bulletList", { listStyleType: "circle" }),
          square: editor.isActive("bulletList", { listStyleType: "square" }),
        },
      };
    },
  });

  if (!editor || !editorState) return null;
  
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
