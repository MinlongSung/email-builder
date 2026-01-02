import type { TextBlockEntity } from "@/entities/template";
import { ProsemirrorToolbar } from "@/richtext/adapter/components/toolbar/ProsemirrorToolbar";

export const TextPanel = ({ block }: { block: TextBlockEntity }) => {
  return (
    <div>
      <ProsemirrorToolbar />
    </div>
  );
};
