import { PreviewNode } from "@/features/blocks/Renderer";

export const BlockOverlay = ({ data }) => {
  const tree = data.tree;
  const [blockId] = tree.rootIds;
  return <PreviewNode blockId={blockId} tree={tree} />;
};
