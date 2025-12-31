import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "@/richtext/core/types";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "@/richtext/core/extensions/utils/isParagraphOrHeading";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize: Extension<"fontSize"> = {
  name: "fontSize",

  marks: {
    fontSize: {
      attrs: { fontSize: { default: null } },
      excludes: "fontSize",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({ fontSize: dom.style.fontSize }),
        },
      ],
      toDOM: (mark) => [
        "span",
        { style: `font-size: ${mark.attrs.fontSize}` },
        0,
      ],
    },
  },

  extendNodes: (nodes) => {
    ["paragraph", "heading"].forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
      if (!nodeSpec) return;

      nodeSpec.attrs = {
        ...nodeSpec.attrs,
        fontSize: { default: null },
      };

      const originalParseDOM = nodeSpec.parseDOM ?? [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => {
          const originalAttrs =
            typeof rule.getAttrs === "function" ? rule.getAttrs(dom) : {};
          return {
            ...originalAttrs,
            fontSize: dom.style.fontSize || null,
          };
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
        const fontSize = node.attrs.fontSize;

        if (fontSize) {
          const existingStyle = attrs.style ?? "";
          attrs.style = existingStyle
            ? `${existingStyle}; font-size: ${fontSize}`
            : `font-size: ${fontSize}`;
        }

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setFontSize:
      (size) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.fontSize;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ fontSize: size }));
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const fontSizeMark = marksAtPos.find((mark) => mark.type === markType);
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark, node }) =>
            mark?.type.name === "fontSize" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.fontSize !== size) {
                tr.removeMark(start, end, markType);
                tr.addMark(start, end, markType.create({ fontSize: size }));
                changed = true;
              }
            }

            if (fontSizeMark) return;

            if (node.attrs.fontSize !== size) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                fontSize: size,
              });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },

    unsetFontSize:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.fontSize;
        if (!markType) return false;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const fontSizeMark = marksAtPos.find((mark) => mark.type === markType);
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark, node }) =>
            mark?.type.name === "fontSize" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.fontSize !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }

            if (fontSizeMark) return;

            if (node.attrs.fontSize !== null) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                fontSize: null,
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
