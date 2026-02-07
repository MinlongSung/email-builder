import type { DOMOutputSpec } from "prosemirror-model";
import type { Extension } from "../types";
import { traverseInRange } from "../extensions/utils/traverseInRange";
import { isParagraphOrHeading } from "../extensions/utils/textNodeChecks";

export type Alignment = "left" | "center" | "right" | "justify";

declare module "../types" {
  interface Commands<ReturnType> {
    textAlign: {
      toggleTextAlign: (align: Alignment) => ReturnType;
    };
  }
}

export const TextAlign: Extension<"textAlign"> = {
  name: "textAlign",

  extendNodes: (nodes) => {
    const nodesToExtend = ["paragraph", "heading"];

    nodesToExtend.forEach((nodeName) => {
      const nodeSpec = nodes[nodeName];
      if (!nodeSpec) return;

      nodeSpec.attrs = {
        ...nodeSpec.attrs,
        textAlign: { default: "left" },
      };

      const originalParseDOM = nodeSpec.parseDOM ?? [];
      nodeSpec.parseDOM = originalParseDOM.map((rule) => ({
        ...rule,
        getAttrs: (dom) => {
          const originalAttrs =
            typeof rule.getAttrs === "function" ? rule.getAttrs(dom) : {};
          return {
            ...originalAttrs,
            textAlign: dom.style.textAlign || "left",
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
        const align = node.attrs.textAlign ?? "left";

        if (align !== "left") {
          const existingStyle = attrs.style ?? "";
          attrs.style = existingStyle
            ? `${existingStyle}; text-align: ${align}`
            : `text-align: ${align}`;
        }

        return [tag, attrs, ...content] as DOMOutputSpec;
      };
    });

    return nodes;
  },

  commands: () => ({
    toggleTextAlign:
      (align) =>
      ({ state, dispatch, tr }) => {
        const { selection } = state;
        const { from, to } = selection;

        let modified = false;

        traverseInRange({
          state,
          from,
          to,
          tr,
          predicate: ({ node }) => isParagraphOrHeading(node),
          callback: ({ node, pos }) => {
            const newAlign = node.attrs.textAlign === align ? "left" : align;

            if (node.attrs.textAlign === newAlign) return;

            if (dispatch) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                textAlign: newAlign,
              });
            }
            modified = true;
          },
        });

        if (modified) dispatch?.(tr);

        return modified;
      },
  }),
};
