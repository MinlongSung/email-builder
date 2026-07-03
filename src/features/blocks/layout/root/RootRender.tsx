import type { RootBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { useEditorStore } from "@/stores/useEditorStore";
import { createStyle } from "@/features/blocks/shared/utils";

interface Props {
  block: RootBlock;
  children?: React.ReactNode;
}

export const RootRender = ({ block, children }: Props) => {
  const isMobile = useEditorStore((s) => s.viewMode === "mobile");
  const isEmpty = block.childrenIds.length === 0;
  const style: React.CSSProperties = {
    ...createStyle(block.props),
    flexBasis: isMobile ? "320px" : block.props.width,
  };

  return (
    <BlockWrapper block={block}>
      <div style={style}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
