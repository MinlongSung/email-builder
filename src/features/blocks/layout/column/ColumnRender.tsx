import type { ColumnBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { createStyle } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/features/stores/useEditorStore";
import { useTemplateStore } from "@/features/stores/useTemplateStore";

interface Props {
  block: ColumnBlock;
  children?: React.ReactNode;
}

export const ColumnRender = ({ block, children }: Props) => {
  const viewport = useEditorStore((s) => s.viewport);

  const template = useTemplateStore((s) => s.template);
  const parent = template.document.blocks[block.parentId];
  const stack = viewport === "mobile" && parent.props.responsive?.mobile?.stack;
  console.log(stack);

  const style = createStyle(block.props, stack && { width: "100%" });
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
