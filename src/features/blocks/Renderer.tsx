import type { Block, BlockTree } from "@/features/models/types";
import { blockRegistry } from "@/features/blocks";

export function BlockNode({
  blockId,
  tree,
}: {
  blockId: string;
  tree: BlockTree;
}) {
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

export function renderCard(block: Block) {
  const definition = blockRegistry[block.type];
  const Component = definition.Card;
  if (!Component) return null;
  return <Component block={block} />;
}
