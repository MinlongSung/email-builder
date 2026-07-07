import type { BlockTree } from "@/features/models/types";
import { blockRegistry } from "@/features/blocks";

interface BlockNodeProps {
  blockId: string;
  tree: BlockTree;
}
export function BlockNode({ blockId, tree }: BlockNodeProps) {
  const block = tree.blocks[blockId];
  const { Render } = blockRegistry[block.type];

  return (
    <Render block={block}>
      {block.childrenIds.map((childId) => (
        <BlockNode key={childId} blockId={childId} tree={tree} />
      ))}
    </Render>
  );
}

interface PreviewNodeProps extends BlockNodeProps {
  ref?: React.Ref<any>;
}

export function PreviewNode({ blockId, tree, ref }: PreviewNodeProps) {
  const block = tree.blocks[blockId];
  const { Preview } = blockRegistry[block.type];

  return (
    <Preview ref={ref} block={block} tree={tree}>
      {block.childrenIds.map((childId) => (
        <PreviewNode key={childId} blockId={childId} tree={tree} />
      ))}
    </Preview>
  );
}
