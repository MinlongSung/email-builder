import { useEffect } from "react";

import { type JSONContent } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";

import { useRichtext } from "@/features/richtext/adapter/hooks/useRichtext";

interface Props {
  content: JSONContent;
}

export const RichtextEditor = ({ content }: Props) => {
  const { editor, syncContent } = useRichtext();

  useEffect(() => {
    syncContent(content);
  }, [content, syncContent]);

  return <EditorContent editor={editor} />;
};
