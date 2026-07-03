import { Extension, type CommandProps } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import {
  isList,
  isListItem,
  isParagraphOrHeading,
  findAncestorNode,
  isRootList,
} from "@/features/richtext/extensions/utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indentation: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export interface IndentationOptions {
  types: string[];
  indentSize: number;
  listMinIndent: number;
}

export const Indentation = Extension.create<IndentationOptions>({
  name: "indentation",

  addOptions() {
    return {
      types: ["paragraph", "heading", "bulletList", "orderedList"],
      indentSize: 24,
      listMinIndent: 40,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: null,
            parseHTML: (el) => {
              const px = parseInt(
                el.style.paddingLeft || el.style.paddingRight || "0",
                10,
              );
              return px || null;
            },
            renderHTML: (attrs) => {
              if (!attrs.indent) return {};
              const side =
                attrs.dir === "rtl" ? "padding-right" : "padding-left";
              return { style: `${side}: ${attrs.indent}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const applyDelta =
      (delta: 1 | -1) =>
      ({ tr, state, dispatch }: CommandProps) => {
        const { from, to } = state.selection;
        const { indentSize, listMinIndent } = this.options;
        let changed = false;

        const updateIndent = (pos: number, node: Node, min: number) => {
          const current = node.attrs.indent ?? min;
          const next = Math.max(min, current + delta * indentSize);
          if (next === current) return;
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
          changed = true;
        };

        tr.doc.nodesBetween(
          from,
          to,
          (node: Node, pos: number, parent: Node | null) => {
            if (isList(node)) {
              const $pos = tr.doc.resolve(pos + 1);
              const root = findAncestorNode($pos, ({ node, parent }) =>
                isRootList(node, parent),
              );
              if (!root) return false;
              updateIndent(root.pos, root.node, listMinIndent);
              return false;
            }

            if (isParagraphOrHeading(node) && !isListItem(parent)) {
              updateIndent(pos, node, 0);
            }
          },
        );

        if (changed) {
          dispatch?.(tr);
          return true;
        }
        return false;
      };

    return {
      indent: () => applyDelta(1),
      outdent: () => applyDelta(-1),
    };
  },
});
