import type { BlockTemplate } from "@/features/models/types";
import { useDraggable } from "@/features/dnd/adapter/hooks/useDraggable";
import { PreviewNode } from "@/features/blocks/Renderer";

interface Props {
  template: BlockTemplate;
}

export function CatalogItem({ template }: Props) {
  const tree = template.create();
  const { setNodeRef } = useDraggable({
    id: template.id,
    data: { type: template.type, tree },
  });

  const [blockId] = tree.rootIds;
  return <PreviewNode ref={setNodeRef} blockId={blockId} tree={tree} />;
}
