import type { ButtonBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { RichtextEditor } from "@/features/richtext/adapter/components/RichtextEditor";
import { createStyle } from "@/features/blocks/shared/utils";

interface Props {
  block: ButtonBlock;
}

export const ButtonRender = ({ block }: Props) => {
  const style = {
    ...createStyle(block.props),
    textDecoration: "none",
  };

  return (
    <BlockWrapper block={block}>
      <div
        className="inline-block max-w-full"
        style={style}
        role="button"
        tabIndex={0}
      >
        <RichtextEditor block={block} />
      </div>
    </BlockWrapper>
  );
};
