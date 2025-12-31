import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "@/richtext/core/types";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "@/richtext/core/extensions/utils/isParagraphOrHeading";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (value: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight: Extension<"lineHeight"> = {
  name: "lineHeight",

  marks: {
    lineHeight: {
      attrs: { lineHeight: { default: null } },
      excludes: "lineHeight",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({
            lineHeight: (dom as HTMLElement).style.lineHeight,
          }),
        },
      ],
      toDOM: (mark) => [
        "span",
        { style: `line-height: ${mark.attrs.lineHeight}` },
        0,
      ],
    },
  },

  extendNodes: (nodes) => {
    ["paragraph", "heading"].forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
      if (!nodeSpec) return;

      nodeSpec.attrs = { ...nodeSpec.attrs, lineHeight: { default: null } };

      const originalParseDOM = nodeSpec.parseDOM ?? [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => ({
          ...((typeof rule.getAttrs === "function"
            ? rule.getAttrs(dom)
            : {}) as any),
          lineHeight: (dom as HTMLElement).style.lineHeight || null,
        }),
      }));

      const originalToDOM = nodeSpec.toDOM;
      nodeSpec.toDOM = (node) => {
        const [tag, attrsRaw, ...content] = (originalToDOM?.(node) as [
          string,
          Record<string, any>,
          ...any[]
        ]) ?? ["div", {}, 0];
        const attrs = { ...attrsRaw };
        const value = node.attrs.lineHeight;
        if (value) {
          const existingStyle = attrs.style ?? "";
          attrs.style = existingStyle
            ? `${existingStyle}; line-height: ${value}`
            : `line-height: ${value}`;
        }
        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setLineHeight:
      (value: string) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.lineHeight;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ lineHeight: value }));
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const lineHeightMark = marksAtPos.find(
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
            mark?.type.name === "lineHeight" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.lineHeight !== value) {
                tr.removeMark(start, end, markType);
                tr.addMark(start, end, markType.create({ lineHeight: value }));
                changed = true;
              }
            }

            if (lineHeightMark) return;

            if (node.attrs.lineHeight !== value) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight: value,
              });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },

    unsetLineHeight:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.lineHeight;
        if (!markType) return false;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const lineHeightMark = marksAtPos.find(
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
            mark?.type.name === "lineHeight" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.lineHeight !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }

            if (lineHeightMark) return;

            if (node.attrs.lineHeight !== null) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight: null,
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
