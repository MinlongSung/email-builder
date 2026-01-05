import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const OrderedListFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        orderedList: {
          decimal: editor.isActive("orderedList", {
            listStyleType: "decimal",
          }),
          lowerAlpha: editor.isActive("orderedList", {
            listStyleType: "lower-alpha",
          }),
          upperAlpha: editor.isActive("orderedList", {
            listStyleType: "upper-alpha",
          }),
          lowerRoman: editor.isActive("orderedList", {
            listStyleType: "lower-roman",
          }),
          upperRoman: editor.isActive("orderedList", {
            listStyleType: "upper-roman",
          }),
        },
      };
    },
  });

  if (!editor || !editorState) return null;

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
