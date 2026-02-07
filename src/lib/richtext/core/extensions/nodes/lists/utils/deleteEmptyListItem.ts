import { EditorState, Transaction } from "prosemirror-state";
import type { NodeType } from "prosemirror-model";
import { liftListItem } from "prosemirror-schema-list";
import { findAncestorNode } from "../../../../extensions/utils/findAncestorNode";
import { isList } from "../../../../extensions/nodes/lists/utils/isList";
import { isListItem } from "../../../../extensions/nodes/lists/utils/isListItem";

export const deleteEmptyListItem =
  (itemType: NodeType) =>
  (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { $from } = state.selection;

    const parentNode = findAncestorNode($from, ({ node }) => isList(node));
    const listItem = findAncestorNode($from, ({ node }) => isListItem(node));
    if (parentNode && listItem && listItem.node.textContent.length === 0) {
      return liftListItem(itemType)(state, dispatch);
    }

    return false;
  };
