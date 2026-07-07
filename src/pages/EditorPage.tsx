import { useEffect } from "react";
import { useTemplateStore } from "@/features/stores/useTemplateStore";
import { SAMPLE_TEMPLATE } from "@/features/templates/sample-template";
import { DndProvider } from "@/features/dnd/adapter/providers/DndProvider";
import { RichtextProvider } from "@/features/richtext/adapter/providers/RichtextProvider";
import { Topbar } from "@/features/components/Topbar";
import { Canvas } from "@/features/components/Canvas";
import { Sidebar } from "@/features/components/Sidebar";
import { PropertyPanel } from "@/features/components/PropertiesPanel";
import { DragOverlay } from "@/features/dnd/adapter/components/DragOverlay";

import type { BlockTree } from "@/features/models/types";
import type { DndState } from "@/features/dnd/core/types";
import { checkIsLeftHalf, checkIsTopHalf } from "@/features/dnd/core/utils";
import { getDroppedOnPath } from "@/features/dnd/adapter/utils/getDroppedOnPath";
import { BlockOverlay } from "@/features/blocks/shared/BlockOverlay";

export const EditorPage = () => {
  const template = useTemplateStore((state) => state.template);
  const setTemplate = useTemplateStore((state) => state.setTemplate);

  useEffect(() => {
    setTemplate(SAMPLE_TEMPLATE);
  }, []);

  if (!template) return null;

  const handleDragMove = (state: DndState, tree: BlockTree) => {
    const path = getDroppedOnPath(state, tree);

    const [droppedOn, over] = path;

    return {
      ...state,
      droppedOn: droppedOn ?? null,
      over: over ?? null,
      isTopHalf: over ? checkIsTopHalf(over.rect, state.coordinates) : false,
      isLeftHalf: over ? checkIsLeftHalf(over.rect, state.coordinates) : false,
    };
  };

  return (
    <DndProvider
      resolvers={{
        onDragMove: (state) => handleDragMove(state, template.document),
      }}
    >
      {({ dragged }) => (
        <RichtextProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <Topbar />
            <main className="relative flex flex-1 overflow-hidden">
              <Canvas />
              <Sidebar />
              <PropertyPanel />
            </main>
          </div>
          <DragOverlay>
            <BlockOverlay data={dragged?.data} />
          </DragOverlay>
        </RichtextProvider>
      )}
    </DndProvider>
  );
};