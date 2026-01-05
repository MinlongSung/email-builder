import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";

export const EmojieSymbolFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  if (!editor) return null;

  return <div style={{ display: "flex", flexDirection: "row", gap: 4 }}></div>;
};
