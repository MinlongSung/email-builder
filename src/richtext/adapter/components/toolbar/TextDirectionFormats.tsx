import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const TextDirectionFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
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
