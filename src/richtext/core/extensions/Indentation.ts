import type { DOMOutputSpec, Node } from "prosemirror-model";
import type { Extension } from "@/richtext/core/types";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "@/richtext/core/extensions/utils/isParagraphOrHeading";
import { findAncestorNode } from "@/richtext/core/extensions/utils/findAncestorNode";
import { isList } from "@/richtext/core/extensions/nodes/lists/utils/isList";
import { isListItem } from "@/richtext/core/extensions/nodes/lists/utils/isListItem";
import { isRootList } from "@/richtext/core/extensions/nodes/lists/utils/isRootList";
import type { Direction } from "@/richtext/core/extensions/TextDirection";

const MIN_LIST_INDENTATION = 40;

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    indentation: {
      setIndentation: (delta: number) => ReturnType;
    };
  }
}

export const Indentation: Extension<"indentation"> = {
  name: "indentation",

  extendNodes: (nodes) => {
    const nodesToExtend = ["paragraph", "heading", "bulletList", "orderedList"];

    nodesToExtend.forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
      if (!nodeSpec) return;

      const defaultIndentation =
        nodeName === "bulletList" || nodeName === "orderedList"
          ? MIN_LIST_INDENTATION
          : 0;

      nodeSpec.attrs = {
        ...nodeSpec.attrs,
        indentation: { default: defaultIndentation },
      };

      const originalParseDOM = nodeSpec.parseDOM || [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => {
          const indentation =
            parseFloat(dom.style.paddingLeft) ||
            parseFloat(dom.style.paddingRight);
          const originalAttrs =
            typeof rule.getAttrs === "function" ? rule.getAttrs(dom) : {};
          return { ...originalAttrs, indentation };
        },
      }));

      const originalToDOM = nodeSpec.toDOM;
      nodeSpec.toDOM = (node) => {
        const [tag, attrsRaw, ...content] = (originalToDOM?.(node) as [
          string,
          Record<string, any>,
          ...any[]
        ]) ?? ["div", {}, 0];
        const attrs = { ...attrsRaw };
        const { indentation, dir } = node.attrs as {
          indentation?: number;
          dir?: Direction;
        };

        if (indentation) {
          const side = dir === "rtl" ? "padding-right" : "padding-left";
          const existingStyle = attrs.style ? `${attrs.style}; ` : "";
          attrs.style = `${existingStyle}${side}: ${indentation}px`;
        }

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setIndentation:
      (delta) =>
      ({ state, dispatch, tr }) => {
        const { from, to } = state.selection;
        let changed = false;
        const rootLists = new Map<number, Node>();

        const updateIndent = (pos: number, node: Node) => {
          const minIndentation =
            node.type.name === "bulletList" || node.type.name === "orderedList"
              ? MIN_LIST_INDENTATION
              : 0;

          const current = Number(node.attrs.indentation || 0);
          const newIndent = Math.max(minIndentation, current + delta);

          if (newIndent !== current) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              indentation: newIndent,
            });
            changed = true;
          }
        };

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
              if (root && !rootLists.has(root.pos))
                rootLists.set(root.pos, root.node);
            } else if (isParagraphOrHeading(node)) {
              updateIndent(pos, node);
            }
          },
        });

        for (const [listPos, listNode] of rootLists) {
          updateIndent(listPos, listNode);
        }

        if (changed) dispatch?.(tr);
        return changed;
      },
  }),
};
