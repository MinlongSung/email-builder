import { useEffect } from "react";
import { useTemplateStore } from "@/stores/useTemplateStore";
import { SAMPLE_TEMPLATE } from "@/features/templates/sample-template";
import { DndProvider } from "@/features/dnd/adapter/providers/DndProvider";
import { RichtextProvider } from "@/features/richtext/adapter/providers/RichtextProvider";
import { Topbar } from "@/features/components/Topbar";
import { Canvas } from "@/features/components/Canvas";
import { Sidebar } from "@/features/components/Sidebar";
import { PropertyPanel } from "@/features/components/PropertiesPanel";
import { DragOverlay } from "@/features/dnd/adapter/components/DragOverlay";

import type { BlockTree } from "@/features/models/types";
import type { DndState, DroppableContainer } from "@/features/dnd/core/types";
import { checkIsLeftHalf, checkIsTopHalf } from "@/features/dnd/core/utils";

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
          <div className="h-screen flex flex-col overflow-hidden">
            <Topbar />
            <main className="relative flex flex-1 overflow-hidden">
              <Canvas />
              <Sidebar />
              <PropertyPanel />
            </main>
          </div>
          <DragOverlay>
            {dragged && (
              <div
                style={{
                  height: 30,
                  width: 30,
                  background: "red",
                }}
              >
                holaaa
              </div>
            )}
          </DragOverlay>
        </RichtextProvider>
      )}
    </DndProvider>
  );
};

export function isValidDropBlock(
  candidate: DroppableContainer | undefined,
  draggedType: string,
) {
  return (
    !!candidate &&
    !candidate.disabled &&
    candidate.data.accepts.includes(draggedType)
  );
}

export function getDroppedOnPath(
  state: DndState,
  tree: BlockTree,
): DroppableContainer[] {
  const { dragged, over, droppables } = state;

  if (!dragged || !over) return [];

  const path: DroppableContainer[] = [];

  let id: string | null = over.id;

  while (id) {
    const block = tree.blocks[id];
    if (!block) break;

    const candidate = droppables[id];
    if (candidate) path.unshift(candidate);
    if (isValidDropBlock(candidate, dragged.data.type)) return path;

    id = block.parentId;
  }

  return [];
}
