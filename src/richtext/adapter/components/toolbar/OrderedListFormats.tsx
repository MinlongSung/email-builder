import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const OrderedListFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() =>
          editor.chain().focus().toggleOrderedList("decimal").run()
        }
        style={{
          backgroundColor: editorState?.orderedList.decimal ? "red" : "",
        }}
        title="Ordered List - 1, 2, 3"
      >
        DECIMAL LIST
      </button>
      <button
        onClick={() =>
          editor.chain().focus().toggleOrderedList("lower-alpha").run()
        }
        style={{
          backgroundColor: editorState?.orderedList.lowerAlpha ? "red" : "",
        }}
        title="Ordered List - a, b, c"
      >
        LOWER ALPHA LIST
      </button>
      <button
        onClick={() =>
          editor.chain().focus().toggleOrderedList("upper-alpha").run()
        }
        style={{
          backgroundColor: editorState?.orderedList.upperAlpha ? "red" : "",
        }}
        title="Ordered List - A, B, C"
      >
        UPPER ALPHA LIST
      </button>
      <button
        onClick={() =>
          editor.chain().focus().toggleOrderedList("lower-roman").run()
        }
        style={{
          backgroundColor: editorState?.orderedList.lowerRoman ? "red" : "",
        }}
        title="Ordered List - i, ii, iii"
      >
        LOWER ROMAN LIST
      </button>
      <button
        onClick={() =>
          editor.chain().focus().toggleOrderedList("upper-roman").run()
        }
        style={{
          backgroundColor: editorState?.orderedList.upperRoman ? "red" : "",
        }}
        title="Ordered List - I, II, III"
      >
        UPPER ROMAN LIST
      </button>
    </div>
  );
};
