import type { RootBlock } from "@/features/models/types";
import { BlockWrapper } from "@/features/blocks/shared/BlockWrapper";
import { DropPlaceholder } from "@/features/dnd/adapter/components/DropPlaceholder";
import { toCss } from "@/features/blocks/shared/utils";
import { useEditorStore } from "@/features/stores/useEditorStore";

interface Props {
  block: RootBlock;
  children?: React.ReactNode;
}

export const RootRender = ({ block, children }: Props) => {
  const viewport = useEditorStore((s) => s.viewport);

  const isMobile = viewport === "mobile";
  const style = toCss(block.props, isMobile && { flexBasis: "320px" });
  const isEmpty = block.childrenIds.length === 0;

  return (
    <BlockWrapper block={block}>
      <div style={style}>
        {isEmpty ? <DropPlaceholder id={block.id} /> : children}
      </div>
    </BlockWrapper>
  );
};
