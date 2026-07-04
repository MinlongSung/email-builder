import type { RowBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { createStyle } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/stores/useEditorStore";

interface Props {
  block: RowBlock;
  children?: React.ReactNode;
}

export const RowRender = ({ block, children }: Props) => {
  const viewport = useEditorStore((s) => s.viewport);

  const stack = viewport === "mobile" && block.props.responsive?.mobile?.stack;
  const style = createStyle(block.props, {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: stack ? "column" : "row",
  });
  
  const isEmpty = block.childrenIds.length === 0;

  return (
    <BlockWrapper block={block}>
      <div style={style}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
