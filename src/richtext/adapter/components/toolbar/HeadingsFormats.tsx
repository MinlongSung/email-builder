import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";

export const HeadingFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
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
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          style={{ backgroundColor: editorState?.heading.h1 ? "red" : "" }}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          style={{ backgroundColor: editorState?.heading.h2 ? "red" : "" }}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          style={{ backgroundColor: editorState?.heading.h3 ? "red" : "" }}
          title="Heading 3"
        >
          H3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          style={{ backgroundColor: editorState?.heading.h4 ? "red" : "" }}
          title="Heading 4"
        >
          H4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          style={{ backgroundColor: editorState?.heading.h5 ? "red" : "" }}
          title="Heading 5"
        >
          H5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          style={{ backgroundColor: editorState?.heading.h6 ? "red" : "" }}
          title="Heading 6"
        >
          H6
        </button>
      </div>
  );
};
