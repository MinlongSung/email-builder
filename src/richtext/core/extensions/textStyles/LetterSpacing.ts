import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "@/richtext/core/types";
import { traverseInRange } from "@/richtext/core/extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "@/richtext/core/extensions/utils/isParagraphOrHeading";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    letterSpacing: {
      setLetterSpacing: (value: string) => ReturnType;
      unsetLetterSpacing: () => ReturnType;
    };
  }
}

export const LetterSpacing: Extension<"letterSpacing"> = {
  name: "letterSpacing",

  marks: {
    letterSpacing: {
      attrs: { letterSpacing: { default: null } },
      excludes: "letterSpacing",
      parseDOM: [
        {
          tag: "span",
          getAttrs: (dom) => ({
            letterSpacing: (dom as HTMLElement).style.letterSpacing,
          }),
        },
      ],
      toDOM: (mark) => [
        "span",
        { style: `letter-spacing: ${mark.attrs.letterSpacing}` },
        0,
      ],
    },
  },

  extendNodes: (nodes) => {
    ["paragraph", "heading"].forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
      if (!nodeSpec) return;

      nodeSpec.attrs = { ...nodeSpec.attrs, letterSpacing: { default: null } };

      const originalParseDOM = nodeSpec.parseDOM ?? [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => ({
          ...((typeof rule.getAttrs === "function"
            ? rule.getAttrs(dom)
            : {}) as any),
          letterSpacing: (dom as HTMLElement).style.letterSpacing || null,
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
        const value = node.attrs.letterSpacing;
        if (value) {
          const existingStyle = attrs.style ?? "";
          attrs.style = existingStyle
            ? `${existingStyle}; letter-spacing: ${value}`
            : `letter-spacing: ${value}`;
        }
        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    setLetterSpacing:
      (value: string) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.letterSpacing;
        if (!markType) return false;

        if (!empty) {
          tr.addMark(from, to, markType.create({ letterSpacing: value }));
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const letterSpacingMark = marksAtPos.find(
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
            mark?.type.name === "letterSpacing" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.letterSpacing !== value) {
                tr.removeMark(start, end, markType);
                tr.addMark(
                  start,
                  end,
                  markType.create({ letterSpacing: value })
                );
                changed = true;
              }
            }

            if (letterSpacingMark) return;

            if (node.attrs.letterSpacing !== value) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                letterSpacing: value,
              });
              changed = true;
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },

    unsetLetterSpacing:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.letterSpacing;
        if (!markType) return false;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        const $pos = state.doc.resolve(from);
        const marksAtPos = $pos.marks();
        const letterSpacingMark = marksAtPos.find(
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
            mark?.type.name === "letterSpacing" || isParagraphOrHeading(node),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.letterSpacing !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }

            if (letterSpacingMark) return;

            if (node.attrs.letterSpacing !== null) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                letterSpacing: null,
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
