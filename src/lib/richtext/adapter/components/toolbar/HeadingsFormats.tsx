import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const HeadingFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        isParagraph: editor.isActive("paragraph"),
        heading: {
          h1: editor.isActive("heading", { level: 1 }),
          h2: editor.isActive("heading", { level: 2 }),
          h3: editor.isActive("heading", { level: 3 }),
          h4: editor.isActive("heading", { level: 4 }),
          h5: editor.isActive("heading", { level: 5 }),
          h6: editor.isActive("heading", { level: 6 }),
        },
      };
    },
  });

  if (!editor || !editorState) return null;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        style={{ backgroundColor: editorState?.isParagraph ? "red" : "" }}
        title="Paragraph"
      >
        P
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={{ backgroundColor: editorState?.heading.h1 ? "red" : "" }}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={{ backgroundColor: editorState?.heading.h2 ? "red" : "" }}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        style={{ backgroundColor: editorState?.heading.h3 ? "red" : "" }}
        title="Heading 3"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        style={{ backgroundColor: editorState?.heading.h4 ? "red" : "" }}
        title="Heading 4"
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        style={{ backgroundColor: editorState?.heading.h5 ? "red" : "" }}
        title="Heading 5"
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        style={{ backgroundColor: editorState?.heading.h6 ? "red" : "" }}
        title="Heading 6"
      >
        H6
      </button>
    </div>
  );
};
