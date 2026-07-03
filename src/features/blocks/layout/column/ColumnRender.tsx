import type { ColumnBlock } from "@/features/models/types";
import { useEditorStore } from "@/stores/useEditorStore";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { createStyle } from "@/features/blocks/shared/utils";

interface Props {
  block: ColumnBlock;
  children?: React.ReactNode;
}

export const ColumnRender = ({ block, children }: Props) => {
  const isMobile = useEditorStore((s) => s.viewMode === "mobile");
  const isEmpty = block.childrenIds.length === 0;

  const baseStyle: React.CSSProperties = {
    ...createStyle(block.props),
    width: isMobile ? "100%" : block.props.width,
  };

  const wrapperStyle = { width: baseStyle.width };
  const style = { padding: baseStyle.padding };

  return (
    <BlockWrapper block={block} style={wrapperStyle}>
      <div style={style}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
