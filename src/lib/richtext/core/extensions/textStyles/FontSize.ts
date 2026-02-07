import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "../../types";
import { traverseInRange } from "../../extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "../../extensions/utils/textNodeChecks";
import type { GlobalConfig } from "../../extensions/types";
import type { Level } from "../../extensions/nodes/Heading";

declare module "../../types" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = (config: GlobalConfig = {}): Extension<"fontSize"> => ({
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

        // Determine fontSize based on node type
        let fontSize = node.attrs.fontSize;

        if (!fontSize && nodeName === "paragraph") {
          fontSize = config.paragraph;
        } else if (!fontSize && nodeName === "heading") {
          const level = node.attrs.level as Level;
          fontSize = config.heading?.[level];
        }

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
      (fontSize) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.fontSize;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ fontSize }));
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
              if (node.attrs.fontSize !== fontSize) {
                tr.removeMark(start, end, markType);
                tr.addMark(start, end, markType.create({ fontSize }));
                changed = true;
              }
            }

            if (fontSizeMark) return;

            if (node.attrs.fontSize !== fontSize) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                fontSize,
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
});
