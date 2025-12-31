import type { DOMOutputSpec, Node } from "prosemirror-model";
import type { Extension } from "@/richtext/core/types";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "@/richtext/core/extensions/utils/isParagraphOrHeading";
import { parseColorFromStyle } from "@/richtext/core/extensions/utils/parseColorFromStyle";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    color: {
      setColor: (color: string) => ReturnType;
      unsetColor: () => ReturnType;
    };
  }
}

export const Color: Extension<"color"> = {
  name: "color",
  marks: {
    color: {
      attrs: { color: { default: null } },
      excludes: "color",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({
            color: parseColorFromStyle(dom, "color"),
          }),
        },
      ],
      toDOM: (mark) => ["span", { style: `color: ${mark.attrs.color}` }, 0],
    },
  },
  extendNodes: (nodes) => {
    ["paragraph", "heading"].forEach((name) => {
      const nodeSpec = nodes[name];
      if (!nodeSpec) return;
      nodeSpec.attrs = { ...nodeSpec.attrs, color: { default: null } };
      const originalToDOM = nodeSpec.toDOM;
      nodeSpec.toDOM = (node: Node) => {
        const [tag, attrsRaw, ...content] = (originalToDOM?.(node) as [
          string,
          Record<string, any>,
          ...any[]
        ]) ?? ["div", {}, 0];
        const attrs = { ...attrsRaw };
        const color = node.attrs.color;
        if (color) {
          attrs.style = attrs.style
            ? `${attrs.style}; color: ${color}`
            : `color: ${color}`;
        }
        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });
    return nodes;
  },
  commands: () => ({
    setColor:
      (color) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.color;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ color }));
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const colorMark = marksAtPos.find((mark) => mark.type === markType);
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark, node }) =>
            mark?.type.name === "color" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.color !== color) {
                tr.removeMark(start, end, markType);
                tr.addMark(start, end, markType.create({ color }));
                changed = true;
              }
            }

            if (colorMark) return;

            if (node.attrs.color !== color) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, color });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },
    unsetColor:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.color;
        if (!markType) return false;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const colorMark = marksAtPos.find((mark) => mark.type === markType);
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark, node }) =>
            mark?.type.name === "color" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.color !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }

            if (colorMark) return;

            if (node.attrs.color != null) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, color: null });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },
  }),
};
