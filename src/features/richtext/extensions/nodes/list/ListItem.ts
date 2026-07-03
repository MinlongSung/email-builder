import { ListItem as Original } from "@tiptap/extension-list";
import { findParentNode } from "@tiptap/core";
import {
  findAncestorNode,
  isList,
  isRootList,
} from "@/features/richtext/extensions/utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    listItem: {
      updateSinkedListItem: () => ReturnType;
    };
  }
}

export const ListItem = Original.extend({
  addCommands() {
    return {
      updateSinkedListItem:
        () =>
        ({ state, tr, dispatch }) => {
          const root = findAncestorNode(
            state.selection.$from,
            ({ node, parent }) => isRootList(node, parent),
          );
          if (!root) return false;

          const currentListNode = findParentNode(isList)(state.selection);
          if (currentListNode === undefined) return false;

          tr.setNodeMarkup(
            currentListNode.pos,
            root.node.type,
            root.node.attrs,
          );

          dispatch?.(tr);

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: () => {
        return this.editor
          .chain()
          .sinkListItem(this.name)
          .updateSinkedListItem()
          .run();
      },
    };
  },
});
