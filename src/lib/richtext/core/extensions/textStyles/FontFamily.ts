import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "../../types";
import { traverseInRange } from "../../extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "../../extensions/utils/textNodeChecks";
import type { GlobalConfig } from "../../extensions/types";
import type { Level } from "../../extensions/nodes/Heading";

declare module "../../types" {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (fontFamily: string) => ReturnType;
      unsetFontFamily: () => ReturnType;
    };
  }
}

export const FontFamily = (
  config: GlobalConfig = {}
): Extension<"fontFamily"> => ({
  name: "fontFamily",

  marks: {
    fontFamily: {
      attrs: { fontFamily: { default: null } },
      excludes: "fontFamily",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({ fontFamily: dom.style.fontFamily }),
        },
      ],
      toDOM: (mark) => [
        "span",
        { style: `font-family: ${mark.attrs.fontFamily}` },
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
        fontFamily: { default: null },
      };

      const originalParseDOM = nodeSpec.parseDOM ?? [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => {
          const originalAttrs =
            typeof rule.getAttrs === "function" ? rule.getAttrs(dom) : {};
          return {
            ...originalAttrs,
            fontFamily: dom.style.fontFamily || null,
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

        // Determine fontFamily based on node type
        let fontFamily = node.attrs.fontFamily;

        if (!fontFamily && nodeName === "paragraph") {
          fontFamily = config.paragraph;
        } else if (!fontFamily && nodeName === "heading") {
          const level = node.attrs.level as Level;
          fontFamily = config.heading?.[level];
        }

        if (fontFamily) {
          const existingStyle = attrs.style ?? "";
          attrs.style = existingStyle
            ? `${existingStyle}; font-family: ${fontFamily}`
            : `font-family: ${fontFamily}`;
        }

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setFontFamily:
      (fontFamily) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.fontFamily;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ fontFamily }));
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const fontFamilyMark = marksAtPos.find(
          (mark) => mark.type === markType
        );
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ node, mark }) =>
            mark?.type.name === "fontFamily" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.fontFamily !== fontFamily) {
                tr.removeMark(start, end, markType);
                tr.addMark(start, end, markType.create({ fontFamily }));
                changed = true;
              }
            }

            if (fontFamilyMark) return;

            if (node.attrs.fontFamily !== fontFamily) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, fontFamily });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },

    unsetFontFamily:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.fontFamily;
        if (!markType) return false;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const fontFamilyMark = marksAtPos.find(
          (mark) => mark.type === markType
        );
        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ node, mark }) =>
            mark?.type.name === "fontFamily" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.fontFamily !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }

            if (fontFamilyMark) return;

            if (node.attrs.fontFamily !== null) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                fontFamily: null,
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
