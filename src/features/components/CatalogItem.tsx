import type { BlockTemplate } from "@/features/models/types";
import { useDraggable } from "@/features/dnd/adapter/hooks/useDraggable";
import { PreviewNode } from "@/features/blocks/Renderer";
import { cn } from "@/components/utils/cn";

interface Props {
  template: BlockTemplate;
}

export function CatalogItem({ template }: Props) {
  const tree = template.create();
  const { setNodeRef, isBeingDragged } = useDraggable({
    id: template.id,
    data: { type: template.type, tree },
  });

  const [blockId] = tree.rootIds;

  return (
    <PreviewNode
      ref={setNodeRef}
      blockId={blockId}
      tree={tree}
      className={cn(isBeingDragged && "opacity-70")}
    />
  );
}
