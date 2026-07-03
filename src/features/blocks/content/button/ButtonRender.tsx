import { flushSync } from "react-dom";

import type { ButtonBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { RichtextEditor } from "@/features/richtext/adapter/components/RichtextEditor";
import { createStyle } from "@/features/blocks/shared/utils";
import { useRichtext } from "@/features/richtext/adapter/hooks/useRichtext";
import { useEditorStore } from "@/stores/useEditorStore";
import { RichtextWrapper } from "@/features/richtext/adapter/components/RichtextWrapper";
import { RichtextPreview } from "@/features/richtext/adapter/components/RichtextPreview";

interface Props {
  block: ButtonBlock;
}

export const ButtonRender = ({ block }: Props) => {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const setSelectedBlockId = useEditorStore((s) => s.setSelectedBlockId);
  const { startEdition } = useRichtext();
  const startEditing = (coordinates) => {
    flushSync(() => setSelectedBlockId(block.id));
    startEdition({ content: block.props.content, coordinates });
  };

  const style = {
    ...createStyle(block.props),
    textDecoration: "none",
  };

  return (
    <BlockWrapper block={block}>
      <RichtextWrapper
        className="inline-block max-w-full"
        style={style}
        role="button"
        tabIndex={0}
        onTextSelection={startEditing}
      >
        {selectedBlockId === block.id ? (
          <RichtextEditor content={block.props.content} />
        ) : (
          <RichtextPreview content={block.props.content} />
        )}
      </RichtextWrapper>
    </BlockWrapper>
  );
};
