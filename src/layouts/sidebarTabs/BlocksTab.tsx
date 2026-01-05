import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { BLOCKS_CATALOG } from "@/data/blocksCatalog";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import type { DndState } from "@/dnd/core/types";
import type { BlockEntity } from "@/entities/template";

import { useCanvasStore } from "@/stores/useCanvasStore";
import { generateId } from "@/utils/generateId";

import { AddBlockCommand } from "@/commands/blocks/AddBlockCommand";
import { historyService } from "@/history/services/historyService";
import { applyStylesToContent } from "@/richtext/adapter/utils/applyGlobalStyles";
import { getOrCreateGlobalEditor } from "@/richtext/adapter/utils/globalEditor";
import { isParagraph } from "@/richtext/core/extensions/utils/textNodeChecks";

export const BlocksTab = () => {
  const getTemplate = useCanvasStore((store) => store.getTemplate);
  const setTemplate = useCanvasStore((store) => store.setTemplate);

  const getColumnCoordinates = useCanvasStore(
    (store) => store.getColumnCoordinates
  );
  const getBlockCoordinates = useCanvasStore(
    (store) => store.getBlockCoordinates
  );

  const handleAdd = (state: DndState) => {
    const template = getTemplate();
    if (!state.dragged || !state.droppedOn || !template) return;
    const sourceBlock = state.dragged.data.item as BlockEntity;

    let coords = getBlockCoordinates(state.droppedOn.id);
    if (!coords) {
      const columnCoords = getColumnCoordinates(state.droppedOn.id);
      if (!columnCoords) return;
      coords = { ...columnCoords, blockIndex: 0 };
    }

    coords.blockIndex += state.isTopHalf ? 0 : 1;

    const addCommand = new AddBlockCommand({
      getTemplate,
      setTemplate,
      sourceBlock,
      rowIndex: coords.rowIndex,
      columnIndex: coords.columnIndex,
      blockIndex: coords.blockIndex,
      generateId,
      onBeforeAdd: (block) => {
        // Aplicar estilos globales según el tipo de bloque
        if (block.type === "text") {
          // Aplicar estilos globales al contenido del bloque de texto
          const newContent = applyStylesToContent({
            content: block.content,
            editor: getOrCreateGlobalEditor(template),
            predicate: ({ node }) => isParagraph(node),
            callback: ({ node, pos, mark, state }, tr) => {
              const { fontFamily, fontSize, lineHeight, letterSpacing, color } =
                template.settings.paragraph;

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                fontFamily: fontFamily ?? node.attrs.fontFamily,
                fontSize: fontSize ?? node.attrs.fontSize,
                lineHeight: lineHeight ?? node.attrs.lineHeight,
                letterSpacing: letterSpacing ?? node.attrs.letterSpacing,
                color: color ?? node.attrs.color,
              });

              if (mark) {
                const linkType = state.schema.marks.link;
                const start = pos;
                const end = pos + node.nodeSize;
                tr.removeMark(start, end, linkType);
                tr.addMark(
                  start,
                  end,
                  linkType.create({
                    ...mark.attrs,
                    color: template.settings.link.color ?? mark.attrs.color,
                    isUnderlined:
                      template.settings.link.isUnderlined ??
                      mark.attrs.isUnderlined,
                  })
                );
              }
            },
          });

          return newContent ? { ...block, content: newContent } : block;
        }  
        
        // if (block.type === "button") {
        //   // Aplicar estilos globales al contenido del bloque de botón
        //   const newContent = applyStylesToContent({
        //     content: block.content,
        //     editor: getOrCreateGlobalEditor(template),
        //     predicate: ({ node }) => node?.type.name === "emailButton",
        //     callback: ({ node, pos }, tr) => {
        //       const {
        //         fontFamily,
        //         fontSize,
        //         lineHeight,
        //         letterSpacing,
        //         color,
        //         backgroundColor,
        //         padding,
        //         borderRadius,
        //         border,
        //       } = template.settings.button;

        //       tr.setNodeMarkup(pos, undefined, {
        //         ...node.attrs,
        //         fontFamily: fontFamily ?? node.attrs.fontFamily,
        //         fontSize: fontSize ?? node.attrs.fontSize,
        //         lineHeight: lineHeight ?? node.attrs.lineHeight,
        //         letterSpacing: letterSpacing ?? node.attrs.letterSpacing,
        //         color: color ?? node.attrs.color,
        //         backgroundColor: backgroundColor ?? node.attrs.backgroundColor,
        //         padding: padding ?? node.attrs.padding,
        //         borderRadius: borderRadius ?? node.attrs.borderRadius,
        //         border: border ?? node.attrs.border,
        //       });
        //     },
        //   });

        //   return newContent ? { ...block, content: newContent } : block;
        // }

        return block;
      },
    });

    historyService.executeCommand(addCommand, {
      id: generateId(),
      type: "block.add",
      timestamp: Date.now(),
    });
  };

  return (
    <section className={"blocksTab__grid"}>
      {BLOCKS_CATALOG.map((block) => (
        <Draggable
          key={block.id}
          id={block.id}
          accepts={[]}
          type={block.type}
          item={block}
          onDragEnd={handleAdd}
        >
          {({ setNodeRef, beingDragged }) => (
            <div ref={setNodeRef} style={{ opacity: beingDragged ? 0.7 : 1 }}>
              {DRAGGABLES_REGISTRY[block.type].sidebar(block as never)}
            </div>
          )}
        </Draggable>
      ))}
    </section>
  );
};
