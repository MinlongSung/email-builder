import { Block } from "@/components/blocks/shared/Block";
import { BLOCK_TYPES, type ColumnEntity } from "@/entities/template";
import { DropPlaceholder } from "@/dnd/adapter/components/DropPlaceholder";
import { Droppable } from "@/dnd/adapter/components/Droppable";
import { Fragment } from "react";

export const Column: React.FC<{ column: ColumnEntity }> = ({ column }) => {
  return (
    <Droppable id={column.id} accepts={BLOCK_TYPES}>
      {({ isOver, setNodeRef }) => (
        <table ref={setNodeRef} width="100%" style={column.style}>
          <tbody>
            <tr>
              <td>
                {column.blocks.length === 0 && (
                  <DropPlaceholder isOver={isOver} />
                )}

                {column.blocks.map((block) => (
                  <Fragment key={block.id}>
                    <Block block={block} />
                  </Fragment>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </Droppable>
  );
};
