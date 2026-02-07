import type { Extension } from "../../../types";
import { toggleList } from "../../../extensions/nodes/lists/utils/toggleList";
import { wrappingInputRule } from "../../../inputRules/wrappingInputRule";

type BulletListType = "disc" | "circle" | "square";

declare module "../../../types" {
  interface Commands<ReturnType> {
    bulletList: {
      toggleBulletList: (listStyleType: BulletListType) => ReturnType;
    };
  }
}

// Input rule: Triggers when user types "- " or "* " at the start of a line
// Example: typing "- item" at start of line → creates bullet list
// Example: typing "* item" at start of line → creates bullet list
const bulletListInputRegex = /^\s*[-*]\s$/;

export const BulletList: Extension<"bulletList"> = {
  name: "bulletList",
  nodes: {
    bulletList: {
      attrs: {
        listStyleType: { default: "disc" },
      },
      content: "listItem+",
      group: "block",
      parseDOM: [
        {
          tag: "ul",
          getAttrs: (dom) => ({
            listStyleType: dom.style.listStyleType || "disc",
          }),
        },
      ],
      toDOM: (node) => [
        "ul",
        {
          style: `list-style-type: ${node.attrs.listStyleType};`,
        },
        0,
      ],
    },
  },

  commands: () => ({
    toggleBulletList:
      (listStyleType: BulletListType) =>
      ({ state, dispatch }) => {
        const listType = state.schema.nodes.bulletList;
        const listItemType = state.schema.nodes.listItem;
        if (!listType || !listItemType) return false;
        return toggleList(listType, listItemType, { listStyleType })(
          state,
          dispatch
        );
      },
  }),
  inputRules: ({ schema }) => {
    const bulletListType = schema.nodes.bulletList;
    if (!bulletListType) return [];

    return [
      wrappingInputRule({
        find: bulletListInputRegex,
        type: bulletListType,
      }),
    ];
  },
};
