import type { DOMOutputSpec, Node } from "prosemirror-model";
import type { Extension } from "@/richtext/core/types";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "@/richtext/core/extensions/utils/textNodeChecks";
import { isList } from "@/richtext/core/extensions/nodes/lists/utils/isList";
import { isListItem } from "@/richtext/core/extensions/nodes/lists/utils/isListItem";
import { findAncestorNode } from "@/richtext/core/extensions/utils/findAncestorNode";
import { isRootList } from "@/richtext/core/extensions/nodes/lists/utils/isRootList";
import { traverseInRangeRecursively } from "@/richtext/core/extensions/utils/traverseInRangeRecursively";

export type Direction = "ltr" | "rtl";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (direction: Direction) => ReturnType;
    };
  }
}

export const TextDirection: Extension<"textDirection"> = {
  name: "textDirection",

  extendNodes: (nodes) => {
    const nodesToExtend = ["paragraph", "heading", "bulletList", "orderedList"];

    nodesToExtend.forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
      if (!nodeSpec) return;

      nodeSpec.attrs = {
        ...nodeSpec.attrs,
        textDirection: { default: null },
      };

      const originalParseDOM = nodeSpec.parseDOM || [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => {
          const dir = dom.getAttribute("dir") || "ltr";
          const originalAttrs =
            typeof rule.getAttrs === "function" ? rule.getAttrs(dom) : {};
          return { ...originalAttrs, textDirection: dir as Direction };
        },
      }));

      const originalToDOM = nodeSpec.toDOM;
      nodeSpec.toDOM = (node) => {
        const result: DOMOutputSpec = originalToDOM?.(node) ?? ["div", {}, 0];
        if (!Array.isArray(result)) return result;

        const [tag, attrsRaw = {}, ...content] = result;
        const attrs = { ...attrsRaw };
        if (node.attrs.textDirection === "rtl")
          attrs.dir = node.attrs.textDirection;

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setTextDirection:
      (direction) =>
      ({ state, dispatch, tr }) => {
        const { selection } = state;
        const { from, to } = selection;

        let changed = false;
        const rootLists = new Map<number, Node>();

        traverseInRange({
          state,
          tr,
          from,
          to,
          predicate: ({ node, parent }) =>
            isList(node) || (isParagraphOrHeading(node) && !isListItem(parent)),
          callback: ({ node, $pos, pos }) => {
            if (node.attrs.textDirection === direction) return;

            if (isList(node)) {
              const root = findAncestorNode($pos, ({ node, $pos }) =>
                isRootList(node, $pos)
              );
              if (root && !rootLists.has(root.pos)) {
                rootLists.set(root.pos, root.node);
              }
            }

            if (isParagraphOrHeading(node)) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                textDirection: direction,
              });
              changed = true;
            }
          },
        });

        for (const [listPos, listNode] of rootLists) {
          traverseInRangeRecursively({
            state,
            tr,
            from: listPos,
            to: listPos + listNode.nodeSize,
            predicate: ({ node }) => isList(node),
            callback: ({ node, pos }) => {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                textDirection: direction,
              });
              changed = true;
            },
          });
        }

        if (changed) dispatch?.(tr);
        return changed;
      },
  }),
};
