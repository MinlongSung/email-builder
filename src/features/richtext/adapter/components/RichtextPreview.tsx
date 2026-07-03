import { useMemo } from "react";

import { generateHTML, type JSONContent } from "@tiptap/core";
import { RICHTEXT_EXTENSIONS } from "@/features/richtext/adapter/presets";

interface Props {
  content: JSONContent;
}

export const RichtextPreview = ({ content }: Props) => {
  const html = useMemo(
    () => generateHTML(content, RICHTEXT_EXTENSIONS),
    [content],
  );

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
