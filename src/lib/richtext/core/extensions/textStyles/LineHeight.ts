import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "../../types";
import { traverseInRange } from "../../extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "../../extensions/utils/textNodeChecks";
import type { GlobalConfig } from "../../extensions/types";
import type { Level } from "../../extensions/nodes/Heading";

declare module "../../types" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = (
  config: GlobalConfig = {}
): Extension<"lineHeight"> => ({
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

        // Determine lineHeight based on node type
        let lineHeight = node.attrs.lineHeight;

        if (!lineHeight && nodeName === "paragraph") {
          lineHeight = config.paragraph;
        } else if (!lineHeight && nodeName === "heading") {
          const level = node.attrs.level as Level;
          lineHeight = config.heading?.[level];
        }

        if (lineHeight) {
          const existingStyle = attrs.style ?? "";
          attrs.style = existingStyle
            ? `${existingStyle}; line-height: ${lineHeight}`
            : `line-height: ${lineHeight}`;
        }

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setLineHeight:
      (lineHeight) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.lineHeight;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ lineHeight }));
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
              if (node.attrs.lineHeight !== lineHeight) {
                tr.removeMark(start, end, markType);
                tr.addMark(start, end, markType.create({ lineHeight }));
                changed = true;
              }
            }

            if (lineHeightMark) return;

            if (node.attrs.lineHeight !== lineHeight) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight,
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
});
