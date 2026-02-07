import { sinkListItem as originalSinkListItem } from "prosemirror-schema-list";
import type { EditorState, Transaction } from "prosemirror-state";
import { findAncestorNode } from "../../../../extensions/utils/findAncestorNode";
import { isList } from "../../../../extensions/nodes/lists/utils/isList";

export const sinkListItem = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void
) => {
  const listItemType = state.schema.nodes.listItem;
  if (!listItemType) return false;

  const parentList = findAncestorNode(state.selection.$from, ({ node }) =>
    isList(node)
  );
  if (!parentList) return false;

  const parentListType = parentList.node.type;
  const parentListAttrs = parentList.node.attrs;

  if (dispatch) {
    let tr = state.tr;

    const sinked = originalSinkListItem(listItemType)(state, (transaction) => {
      tr = transaction;
    });

    if (!sinked) return false;

    const newState = state.apply(tr);
    const { $from } = newState.selection;
    const currentList = findAncestorNode($from, ({ node }) => isList(node));
    if (currentList)
      tr.setNodeMarkup(currentList.pos, parentListType, parentListAttrs);

    dispatch(tr);
  }

  return true;
};
