import type { RootBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { createStyle } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/features/stores/useEditorStore";

interface Props {
  block: RootBlock;
  children?: React.ReactNode;
}

export const RootRender = ({ block, children }: Props) => {
  const viewport = useEditorStore((s) => s.viewport);

  const style = createStyle(block.props, {
    flexBasis:
      viewport === "mobile"
        ? "320px"
        : (block.props.layout?.maxWidth ?? block.props.layout?.width),
  });
  const isEmpty = block.childrenIds.length === 0;

  return (
    <BlockWrapper block={block} style={style}>
      {isEmpty ? <DropPlaceholder id={block.id} /> : children}
    </BlockWrapper>
  );
};
