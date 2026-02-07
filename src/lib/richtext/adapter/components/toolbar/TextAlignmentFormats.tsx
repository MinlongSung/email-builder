import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const TextAlignmentFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        textAlign: {
          left: editor.isActive({ textAlign: "left" }),
          center: editor.isActive({ textAlign: "center" }),
          right: editor.isActive({ textAlign: "right" }),
          justify: editor.isActive({ textAlign: "justify" }),
        },
      };
    },
  });

  if (!editor || !editorState) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
        style={{ backgroundColor: editorState?.textAlign.left ? "red" : "" }}
        title="Align Left"
      >
        ALIGN LEFT
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTextAlign("center").run()}
        style={{
          backgroundColor: editorState?.textAlign.center ? "red" : "",
        }}
        title="Align Center"
      >
        ALIGN CENTER
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTextAlign("right").run()}
        style={{ backgroundColor: editorState?.textAlign.right ? "red" : "" }}
        title="Align Right"
      >
        ALIGN RIGHT
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTextAlign("justify").run()}
        style={{
          backgroundColor: editorState?.textAlign.justify ? "red" : "",
        }}
        title="Justify"
      >
        ALIGN JUSTIFY
      </button>
    </div>
  );
};
