import type { TextBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { RichtextEditor } from "@/features/richtext/adapter/components/RichtextEditor";
import { createStyle } from "@/features/blocks/shared/utils";

interface Props {
  block: TextBlock;
}

export const TextRender = ({ block }: Props) => {
  const style = createStyle(block.props);
  return (
    <BlockWrapper block={block}>
      <div style={style}>
        <RichtextEditor block={block} />
      </div>
    </BlockWrapper>
  );
};
