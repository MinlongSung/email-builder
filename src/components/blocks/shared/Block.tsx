import { useTranslation } from "react-i18next";

import { BLOCK_TYPES, type BlockEntity } from "@/entities/template";
import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { SelectionCard } from "@/components/blocks/shared/SelectionCard";
import {
  CloneAction,
  DeleteAction,
  MoveAction,
} from "@/components/blocks/shared/SelectionCardActions";
import { Draggable } from "@/dnd/adapter/components/Draggable";

import { DropIndicator } from "@/dnd/adapter/components/DropIndicator";
import { useBlock } from "@/components/blocks/shared/hooks/useBlock";

interface BlockProps {
  block: BlockEntity;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
  const { t } = useTranslation();
  const { cloneBlock, removeBlock, moveBlock } = useBlock(block);

  return (
    <Draggable
      id={block.id}
      accepts={BLOCK_TYPES}
      item={block}
      type={block.type}
      handle={"[data-drag-handle]"}
      onDragEnd={moveBlock}
    >
      {({ setNodeRef, overId, isTopHalf, beingDragged }) => (
        <SelectionCard
          ref={setNodeRef}
          id={block.id}
          label={t(block.type)}
          actions={[
            <MoveAction label={t("move")} />,
            <CloneAction label={t("clone")} onClick={cloneBlock} />,
            <DeleteAction label={t("delete")} onClick={removeBlock} />,
          ]}
        >
          {overId === block.id && isTopHalf && (
            <DropIndicator label={t("drop_here")} />
          )}
          <div style={{ opacity: beingDragged ? 0.7 : 1 }}>
            {DRAGGABLES_REGISTRY[block.type].interactable(block as never)}
          </div>
          {overId === block.id && !isTopHalf && (
            <DropIndicator label={t("drop_here")} />
          )}
        </SelectionCard>
      )}
    </Draggable>
  );
};
