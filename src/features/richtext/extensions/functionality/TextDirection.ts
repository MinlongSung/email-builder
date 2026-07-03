import { Extension } from "@tiptap/core";
import {
  isList,
  isListItem,
  isParagraphOrHeading,
  findAncestorNode,
  isRootList,
} from "@/features/richtext/extensions/utils";

export type Direction = "ltr" | "rtl";

export interface TextDirectionOptions {
  types: string[];
  direction: Direction;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (dir: Direction) => ReturnType;
      toggleTextDirection: () => ReturnType;
    };
  }
}

export const TextDirection = Extension.create<TextDirectionOptions>({
  name: "textDirection",

  addOptions() {
    return {
      types: ["paragraph", "heading", "bulletList", "orderedList"],
      direction: "ltr",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.direction ?? null,
            parseHTML: (el) => el.getAttribute("dir") || null,
            renderHTML: (attrs: Record<string, unknown>) => {
              if (!attrs.dir || attrs.dir === "ltr") return {};
              return { dir: attrs.dir };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextDirection:
        (dir) =>
        ({ tr, state, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;

          tr.doc.nodesBetween(from, to, (node, pos, parent) => {
            if (isList(node)) {
              const $pos = tr.doc.resolve(pos + 1);
              const root = findAncestorNode($pos, ({ node, parent }) =>
                isRootList(node, parent),
              );
              if (!root) return false;
              tr.setNodeMarkup(root.pos, undefined, {
                ...root.node.attrs,
                dir,
              });
              changed = true;
              return false;
            }

            if (isParagraphOrHeading(node) && !isListItem(parent)) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, dir });
              changed = true;
            }
          });

          if (changed) {
            dispatch?.(tr);
            return true;
          }
          return false;
        },

      toggleTextDirection:
        () =>
        ({ state, commands }) => {
          const { $from } = state.selection;
          const current =
            $from.node($from.depth).attrs.dir ?? this.options.direction;
          const next: Direction = current === "rtl" ? "ltr" : "rtl";
          return commands.setTextDirection(next);
        },
    };
  },
});
