import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";

export const LinkFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      return {
        isLink: editor.isActive("link"),
      };
    },
  });

  if (!editor || !editorState) return null;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        style={{ backgroundColor: editorState?.isLink ? "red" : "" }}
        title="Insert Link"
      >
        LINK
      </button>

      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        title="Remove Link"
        disabled={editorState?.isLink}
      >
        UNLINK
      </button>
    </div>
  );
};
