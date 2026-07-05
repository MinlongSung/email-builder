import type { TextBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { RichtextEditor } from "@/features/richtext/adapter/components/RichtextEditor";
import { toCss } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/features/stores/useEditorStore";
import { flushSync } from "react-dom";
import { useRichtext } from "@/features/richtext/adapter/hooks/useRichtext";
import { RichtextWrapper } from "@/features/richtext/adapter/components/RichtextWrapper";
import { RichtextPreview } from "@/features/richtext/adapter/components/RichtextPreview";

interface Props {
  block: TextBlock;
}

export const TextRender = ({ block }: Props) => {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const setSelectedBlockId = useEditorStore((s) => s.setSelectedBlockId);
  const { startEdition } = useRichtext();
  const startEditing = (coordinates) => {
    flushSync(() => setSelectedBlockId(block.id));
    startEdition({ content: block.props.content, coordinates });
  };

  const style = toCss(block.props);

  return (
    <BlockWrapper block={block}>
      <RichtextWrapper style={style} onTextSelection={startEditing}>
        {selectedBlockId === block.id ? (
          <RichtextEditor content={block.props.content} />
        ) : (
          <RichtextPreview content={block.props.content} />
        )}
      </RichtextWrapper>
    </BlockWrapper>
  );
};
