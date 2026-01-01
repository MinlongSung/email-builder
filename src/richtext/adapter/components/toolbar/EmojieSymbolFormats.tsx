import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const EmojieSymbolFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
  return (
      <div style={{ display: "flex", flexDirection: "row", gap: 4 }}></div>

  );
};
