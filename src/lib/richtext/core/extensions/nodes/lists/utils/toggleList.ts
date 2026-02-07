import { type EditorState, type Transaction } from "prosemirror-state";
import { liftListItem, wrapInList } from "prosemirror-schema-list";
import type { Node, NodeType } from "prosemirror-model";

import { traverseInRange } from "../../../../extensions/utils/traverseInRange";
import { isList } from "../../../../extensions/nodes/lists/utils/isList";
import { isParagraphOrHeading } from "../../../../extensions/utils/textNodeChecks";
import { findAncestorNode } from "../../../../extensions/utils/findAncestorNode";
import { isRootList } from "../../../../extensions/nodes/lists/utils/isRootList";
import { traverseInRangeRecursively } from "../../../../extensions/utils/traverseInRangeRecursively";
import { isListItem } from "../../../../extensions/nodes/lists/utils/isListItem";

export const toggleList =
  (listType: NodeType, listItemType: NodeType, attrs: Record<string, any>) =>
  (
    state: EditorState,
    dispatch: ((tr: Transaction) => void) | undefined
  ): boolean => {
    const { from, to } = state.selection;
    const tr = state.tr;

    // --------
    // FASE 1: ANALIZAR
    // --------
    const rootLists = new Map<number, Node>();
    const paragraphsAndHeadingsOutsideList: { pos: number; node: Node }[] = [];

    traverseInRange({
      state,
      tr,
      from,
      to,
      predicate: ({ node, parent }) =>
        isList(node) || (isParagraphOrHeading(node) && !isListItem(parent)),
      callback: ({ node, $pos, pos }) => {
        if (isList(node)) {
          const root = findAncestorNode($pos, ({ node, $pos }) =>
            isRootList(node, $pos)
          );
          if (root && !rootLists.has(root.pos)) {
            rootLists.set(root.pos, root.node);
          }
        }

        if (isParagraphOrHeading(node)) {
          paragraphsAndHeadingsOutsideList.push({ pos, node });
        }
      },
    });

    // --------
    // FASE 2: UNWRAP (si todo coincide)
    // --------
    const shouldUnwrap =
      rootLists.size &&
      !paragraphsAndHeadingsOutsideList.length &&
      [...rootLists.values()].every(
        (list) =>
          list.type === listType &&
          list.attrs.listStyleType === attrs.listStyleType
      );

    if (shouldUnwrap) {
      if (dispatch) {
        liftListItem(listItemType)(state, dispatch);
      }
      return true;
    }

    // --------
    // FASE 3: CONVERTIR LISTAS EXISTENTES (recursivo)
    // --------
    let changed = false;

    for (const [listPos, listNode] of rootLists) {
      traverseInRangeRecursively({
        state,
        tr,
        from: listPos,
        to: listPos + listNode.nodeSize,
        predicate: ({ node }) => isList(node),
        callback: ({ pos }) => {
          tr.setNodeMarkup(pos, listType, attrs);
          changed = true;
        },
      });
    }

    // --------
    // FASE 4: WRAP BLOQUES SUELTOS
    // --------
    if (
      !rootLists.size &&
      paragraphsAndHeadingsOutsideList.length &&
      dispatch
    ) {
      wrapInList(listType, attrs)(state, dispatch);
      changed = true;
    }

    // --------
    // FINAL
    // --------
    if (changed) dispatch?.(tr);

    return changed;
  };
