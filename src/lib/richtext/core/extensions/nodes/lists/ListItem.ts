import { liftListItem, splitListItemKeepMarks } from "prosemirror-schema-list";

import { keymap } from "prosemirror-keymap";
import type { Extension } from "../../../types";
import { sinkListItem } from "../../../extensions/nodes/lists/utils/sinkListItem";
import { deleteEmptyListItem } from "../../../extensions/nodes/lists/utils/deleteEmptyListItem";

declare module "../../../types" {
  interface Commands<ReturnType> {
    listItem: {
      sinkListItem: () => ReturnType;
      liftListItem: () => ReturnType;
    };
  }
}

export const ListItem: Extension<"listItem"> = {
  name: "listItem",
  priority: 101,
  nodes: {
    listItem: {
      content: "(paragraph | heading) block*",
      defining: true,
      parseDOM: [{ tag: "li" }],
      toDOM: () => ["li", 0],
    },
  },
  commands: () => ({
    sinkListItem:
      () =>
      ({ state, dispatch }) => {
        return sinkListItem(state, dispatch);
      },
    liftListItem:
      () =>
      ({ state, dispatch }) => {
        const listItemType = state.schema.nodes.listItem;
        if (!listItemType) return false;
        return liftListItem(listItemType)(state, dispatch);
      },
  }),
  plugins: ({ schema }) => [
    keymap({
      Tab: sinkListItem,
      "Shift-Tab": liftListItem(schema.nodes.listItem),
      Enter: splitListItemKeepMarks(schema.nodes.listItem),
      Backspace: deleteEmptyListItem(schema.nodes.listItem),
      Delete: deleteEmptyListItem(schema.nodes.listItem),
    }),
  ],
};
