import type { RowBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { useEditorStore } from "@/stores/useEditorStore";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { createStyle } from "@/features/blocks/shared/utils";

interface Props {
  block: RowBlock;
  children?: React.ReactNode;
}

export const RowRender = ({ block, children }: Props) => {
  const isMobile = useEditorStore((s) => s.viewMode === "mobile");
  const isEmpty = block.childrenIds.length === 0;
  const style: React.CSSProperties = {
    ...createStyle(block.props),
    flexDirection: isMobile && block.props.isResponsive ? "column" : "row",
  };

  return (
    <BlockWrapper block={block}>
      <div className="flex items-start" style={style}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
