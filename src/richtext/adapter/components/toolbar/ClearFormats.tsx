import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";

export const ClearFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  if (!editor) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        CLEAR
      </button>
    </div>
  );
};
