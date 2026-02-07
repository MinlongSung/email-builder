import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const TextDirectionFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        direction: {
          ltr: editor.isActive({ dir: "ltr" }),
          rtl: editor.isActive({ dir: "rtl" }),
        },
      };
    },
  });

  if (!editor || !editorState) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.commands.setTextDirection("ltr")}
        style={{ backgroundColor: editorState?.direction.ltr ? "red" : "" }}
        title="Left to Right"
      >
        LTR{" "}
      </button>
      <button
        onClick={() => editor.commands.setTextDirection("rtl")}
        style={{ backgroundColor: editorState?.direction.rtl ? "red" : "" }}
        title="Right to Left"
      >
        RTL
      </button>
    </div>
  );
};
