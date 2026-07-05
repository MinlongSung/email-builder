import { useScrollable } from "@/features/dnd/adapter/hooks/useScrollable";
import { useTemplateStore } from "@/features/stores/useTemplateStore";
import { BlockNode } from "@/features/blocks/Renderer";

export function Canvas() {
  const template = useTemplateStore((s) => s.template);
  const [blockId] = template.document.rootIds;
  const { setNodeRef } = useScrollable({ id: "canvas" });

  return (
    <div className="flex-1 bg-gray-100 overflow-auto" ref={setNodeRef}>
      <div className="min-w-max min-h-full flex items-center justify-center p-12">
        <div className="flex bg-white shadow-md">
          <BlockNode blockId={blockId} tree={template.document} />
        </div>
      </div>
    </div>
  );
}
