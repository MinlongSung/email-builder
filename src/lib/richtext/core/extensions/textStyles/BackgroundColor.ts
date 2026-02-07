import type { DOMOutputSpec, Node } from "prosemirror-model";
import type { Extension } from "../../types";
import { traverseInRange } from "../../extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "../../extensions/utils/textNodeChecks";

declare module "../../types" {
  interface Commands<ReturnType> {
    backgroundColor: {
      setBackgroundColor: (color: string) => ReturnType;
      unsetBackgroundColor: () => ReturnType;
    };
  }
}

export const BackgroundColor: Extension<"backgroundColor"> = {
  name: "backgroundColor",
  marks: {
    backgroundColor: {
      attrs: { backgroundColor: { default: null } },
      excludes: "backgroundColor",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({
            backgroundColor: dom.style.backgroundColor,
          }),
        },
      ],
      toDOM: (mark) => [
        "span",
        { style: `background-color: ${mark.attrs.backgroundColor}` },
        0,
      ],
    },
  },
  extendNodes: (nodes) => {
    ["paragraph", "heading"].forEach((name) => {
      const nodeSpec = nodes[name];
      if (!nodeSpec) return;
      nodeSpec.attrs = {
        ...nodeSpec.attrs,
        backgroundColor: { default: null },
      };
      const originalToDOM = nodeSpec.toDOM;
      nodeSpec.toDOM = (node: Node) => {
        const [tag, attrsRaw, ...content] = (originalToDOM?.(node) as [
          string,
          Record<string, any>,
          ...any[]
        ]) ?? ["div", {}, 0];
        const attrs = { ...attrsRaw };
        const bg = node.attrs.backgroundColor;
        if (bg) {
          attrs.style = attrs.style
            ? `${attrs.style}; background-color: ${bg}`
            : `background-color: ${bg}`;
        }
        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });
    return nodes;
  },
  commands: () => ({
    setBackgroundColor:
      (color) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.backgroundColor;

        if (!empty) {
          tr.addMark(from, to, markType.create({ backgroundColor: color }));
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const backgroundColorMark = marksAtPos.find(
          (mark) => mark.type === markType
        );
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark, node }) =>
            mark?.type.name === "backgroundColor" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.color !== color) {
                tr.removeMark(start, end, markType);
                tr.addMark(
                  start,
                  end,
                  markType.create({ backgroundColor: color })
                );
                changed = true;
              }
            }

            if (backgroundColorMark) return;

            if (node.attrs.backgroundColor !== color) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                backgroundColor: color,
              });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },
    unsetBackgroundColor:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.backgroundColor;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const backgroundColorMark = marksAtPos.find(
          (mark) => mark.type === markType
        );
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark, node }) =>
            mark?.type.name === "backgroundColor" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.color !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }

            if (backgroundColorMark) return;

            if (node.attrs.backgroundColor !== null) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                backgroundColor: null,
              });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },
  }),
};
