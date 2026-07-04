import type { ColumnBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { createStyle } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/stores/useEditorStore";

interface Props {
  block: ColumnBlock;
  children?: React.ReactNode;
}

export const ColumnRender = ({ block, children }: Props) => {
  const viewport = useEditorStore((s) => s.viewport);

  const stack = viewport === "mobile" && block.props.responsive?.mobile?.stack;
  const style = createStyle(block.props, {
    width: stack ? "100%" : block.props.layout?.width,
  });
  const wrapperStyle = { width: style.width };
  const contentStyle = { padding: style.padding };

  const isEmpty = block.childrenIds.length === 0;

  return (
    <BlockWrapper block={block} style={wrapperStyle}>
      <div style={contentStyle}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
