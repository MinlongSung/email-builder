import { Extension } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { ListKeymap } from "@tiptap/extension-list";

import { ListItem } from "@/features/richtext/extensions/nodes/list/ListItem";
import { BulletList } from "@/features/richtext/extensions/nodes/list/BulletList";
import { OrderedList } from "@/features/richtext/extensions/nodes/list/OrderedList";
import {
  type ListStyleValue,
  getListTypeByStyleValue,
} from "@/features/richtext/extensions/nodes/list/utils";
import {
  findAncestorNode,
  isList,
  isListItem,
  isRootList,
} from "@/features/richtext/extensions/utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    listKit: {
      setList: (value: ListStyleValue) => ReturnType;
    };
  }
}

export const ListKit = Extension.create({
  name: "listKit",

  addExtensions() {
    return [ListItem, BulletList, OrderedList, ListKeymap];
  },

  addCommands() {
    return {
      setList:
        (value?: ListStyleValue) =>
        ({ state, tr, dispatch, commands, chain }) => {
          const { schema } = state;
          const { $from } = state.selection;

          const listName = getListTypeByStyleValue(value);
          const listType = listName ? schema.nodes[listName] : null;

          const listItemNode = findAncestorNode($from, ({ node }) =>
            isListItem(node),
          );

          if (!listItemNode && listName) {
            return chain()
              .toggleList(listName, "listItem", true, { listStyleType: value })
              .run();
          }

          const root = findAncestorNode($from, ({ node, parent }) =>
            isRootList(node, parent),
          );
          if (!root) return false;

          const isSameType = root.node.type === listType;
          const isSameStyle = root.node.attrs.listStyleType === value;
          if (isSameType && isSameStyle) return commands.liftListItem("listItem");

          const updateNode = (pos: number, node: Node) => {
            tr.setNodeMarkup(pos, listType, {
              ...node.attrs,
              listStyleType: value,
            });
          };

          updateNode(root.pos, root.node);
          root.node.descendants((node: Node, offset: number) => {
            if (!isList(node)) return true;
            updateNode(root.pos + offset + 1, node);
            return true;
          });

          dispatch?.(tr);
          return true;
        },
    };
  },
});
