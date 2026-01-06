import { Block } from "@/components/blocks/shared/Block";
import { BLOCK_TYPES, type ColumnEntity } from "@/entities/template";
import { DropPlaceholder } from "@/dnd/adapter/components/DropPlaceholder";
import { Droppable } from "@/dnd/adapter/components/Droppable";

export const Column: React.FC<{ column: ColumnEntity }> = ({ column }) => {
  return (
    <Droppable id={column.id} accepts={BLOCK_TYPES}>
      {({ isOver, setNodeRef }) => (
        <table ref={setNodeRef} width="100%" style={column.style}>
          <tbody>
            {column.blocks.length === 0 && (
              <tr>
                <td>
                  <DropPlaceholder isOver={isOver} />
                </td>
              </tr>
            )}

            {column.blocks.map((block) => (
              <tr key={block.id}>
                <td>
                  <Block block={block} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Droppable>
  );
};
