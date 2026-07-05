import type { RowBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { toCss } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/features/stores/useEditorStore";

interface Props {
  block: RowBlock;
  children?: React.ReactNode;
}

export const RowRender = ({ block, children }: Props) => {
  const viewport = useEditorStore((s) => s.viewport);

  const stack = viewport === "mobile" && block.props.responsive?.mobile?.stack;
  const style = toCss(
    block.props,
    {
      display: "flex",
      alignItems: "flex-start",
    },
    stack && { flexDirection: "column" },
  );

  const isEmpty = block.childrenIds.length === 0;

  return (
    <BlockWrapper block={block}>
      <div style={style}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
