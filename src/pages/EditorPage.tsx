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
import { BlockOverlay } from "@/features/blocks/shared/BlockOverlay";
import {
  getBlockById,
  getTreePositions,
} from "@/features/document/core/queries";
import { MoveTreeCommand } from "@/features/document/core/commands/move/MoveTreeCommand";
import { AddTreeCommand } from "@/features/document/core/commands/add/AddTreeCommand";
import { useHistory } from "@/features/document/adapter/hooks/useHistory";
import {
  getInsertionIndex,
  resolveDragState,
} from "@/features/dnd/adapter/utils";
import {
  checkIsSamePosition,
  duplicateTree,
  resolveInsertionIndex,
} from "@/features/document/core/utils";

export const EditorPage = () => {
  const template = useTemplateStore((state) => state.template);
  const setTemplate = useTemplateStore((state) => state.setTemplate);

  useEffect(() => {
    setTemplate(SAMPLE_TEMPLATE);
  }, []);

  const { execute } = useHistory();

  if (!template) return null;

  const handleDrop = (state: DndState, tree: BlockTree) => {
    const { dragged, droppedOn } = state;

    if (!droppedOn) return;

    const index = getInsertionIndex(state, tree);

    const exists = !!getBlockById(tree, dragged.id);

    if (!exists) {
      execute(
        new AddTreeCommand(
          duplicateTree(dragged.data.tree, dragged.data.tree.rootIds),
          droppedOn.id,
          index,
        ),
        {
          action: "add",
          targets: [],
        },
      );

      return;
    }

    const resolvedIndex = resolveInsertionIndex({
      tree,
      blockId: dragged.id,
      parentId: droppedOn.id,
      index,
    });

    if (
      checkIsSamePosition({
        tree,
        blockId: dragged.id,
        parentId: droppedOn.id,
        index: resolvedIndex,
      })
    ) {
      return;
    }

    execute(
      new MoveTreeCommand(tree, dragged.data.tree.rootIds, {
        parentId: droppedOn.id,
        index: resolvedIndex,
      }),
      {
        action: "move",
        targets: [],
      },
    );
  };

  return (
    <DndProvider
      resolvers={{
        onDragMove: (state) => resolveDragState(state, template.document),
        onDrop: (state) => resolveDragState(state, template.document),
      }}
      callbacks={{
        onDrop: (state) => handleDrop(state, template.document),
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
