import type { DOMOutputSpec, Mark, Node } from "prosemirror-model";
import type { Extension } from "../../types";
import { traverseInRange } from "../../extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "../../extensions/utils/textNodeChecks";
import type { GlobalConfig } from "../../extensions/types";
import type { Level } from "../../extensions/nodes/Heading";
import { isLink } from "../../extensions/marks/link/utils/isLink";
declare module "../../types" {
  interface Commands<ReturnType> {
    color: {
      setColor: (color: string) => ReturnType;
      unsetColor: () => ReturnType;
    };
  }
}

export const Color = (config: GlobalConfig = {}): Extension<"color"> => ({
  name: "color",
  marks: {
    color: {
      attrs: { color: { default: null } },
      excludes: "color",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({
            color: dom.style.color,
          }),
        },
      ],
      toDOM: (mark) => ["span", { style: `color: ${mark.attrs.color}` }, 0],
    },
  },
  extendNodes: (nodes) => {
    ["paragraph", "heading"].forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
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

        // Determine color based on node type
        let color = node.attrs.color;

        if (!color && nodeName === "paragraph") {
          color = config.paragraph;
        } else if (!color && nodeName === "heading") {
          const level = node.attrs.level as Level;
          color = config.heading?.[level];
        }

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

  extendMarks: (marks) => {
    ["link"].forEach((markName) => {
      const markSpec = marks[markName];
      if (!markSpec) return;

      markSpec.attrs = { ...markSpec.attrs, color: { default: null } };

      const originalToDOM = markSpec.toDOM;
      markSpec.toDOM = (mark: Mark, inline: boolean) => {
        const [tag, attrsRaw, ...content] = (originalToDOM?.(mark, inline) as [
          string,
          Record<string, any>,
          ...any[]
        ]) ?? ["a", {}, 0];
        const attrs = { ...attrsRaw };
        let color = mark.attrs.color;
        if (!color && markName === "link") {
          color = config.link;
        }
        
        if (color) {
          attrs.style = attrs.style
            ? `${attrs.style}; color: ${color}`
            : `color: ${color}`;
        }

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return marks;
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
          predicate: ({ node, mark }) =>
            mark?.type.name === "color" || isParagraphOrHeading(node) ||isLink(mark),
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
          predicate: ({ node, mark }) =>
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
});
