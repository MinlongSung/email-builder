import type { Extension } from "../../../types";
import { toggleList } from "../../../extensions/nodes/lists/utils/toggleList";
import { wrappingInputRule } from "../../../inputRules/wrappingInputRule";

type OrderedListType =
  | "decimal"
  | "lower-alpha"
  | "upper-alpha"
  | "lower-roman"
  | "upper-roman";

declare module "../../../types" {
  interface Commands<ReturnType> {
    orderedList: {
      toggleOrderedList: (listStyleType: OrderedListType) => ReturnType;
    };
  }
}

// Input rule: Triggers when user types "1. ", "2. ", etc. at the start of a line
// Example: typing "1. item" at start of line → creates ordered list
// Captures the number to potentially set the start attribute
const orderedListInputRegex = /^(\d+)\.\s$/;

export const OrderedList: Extension<"orderedList"> = {
  name: "orderedList",
  nodes: {
    orderedList: {
      attrs: {
        listStyleType: { default: "decimal" },
      },
      content: "listItem+",
      group: "block",
      parseDOM: [
        {
          tag: "ol",
          getAttrs: (dom) => ({
            listStyleType: dom.style.listStyleType || "disc",
          }),
        },
      ],
      toDOM: (node) => [
        "ol",
        {
          style: `list-style-type: ${node.attrs.listStyleType};`,
        },
        0,
      ],
    },
  },
  commands: () => ({
    toggleOrderedList:
      (listStyleType: OrderedListType) =>
      ({ state, dispatch }) => {
        const listType = state.schema.nodes.orderedList;
        const listItemType = state.schema.nodes.listItem;
        if (!listType || !listItemType) return false;
        return toggleList(listType, listItemType, { listStyleType })(
          state,
          dispatch
        );
      },
  }),
  inputRules: ({ schema }) => {
    const orderedListType = schema.nodes.orderedList;
    if (!orderedListType) return [];

    return [
      wrappingInputRule({
        find: orderedListInputRegex,
        type: orderedListType,
      }),
    ];
  },
};
