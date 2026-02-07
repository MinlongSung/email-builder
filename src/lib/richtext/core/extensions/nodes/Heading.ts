import { setBlockType } from "prosemirror-commands";
import type { Extension } from "../../types";
import { textblockTypeInputRule } from "../../inputRules/textblockTypeInputRule";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;
export const levels: Level[] = [1, 2, 3, 4, 5, 6];

// Input rule: Triggers when user types "# " at the start of a line → creates H1 heading
// Example: typing "# Title" at start of line → converts to <h1>Title</h1>
const heading1InputRegex = /^#\s$/;

// Input rule: Triggers when user types "## " at the start of a line → creates H2 heading
// Example: typing "## Subtitle" at start of line → converts to <h2>Subtitle</h2>
const heading2InputRegex = /^##\s$/;

// Input rule: Triggers when user types "### " at the start of a line → creates H3 heading
// Example: typing "### Section" at start of line → converts to <h3>Section</h3>
const heading3InputRegex = /^###\s$/;

// Input rule: Triggers when user types "#### " at the start of a line → creates H4 heading
// Example: typing "#### Subsection" at start of line → converts to <h4>Subsection</h4>
const heading4InputRegex = /^####\s$/;

// Input rule: Triggers when user types "##### " at the start of a line → creates H5 heading
// Example: typing "##### Minor heading" at start of line → converts to <h5>Minor heading</h5>
const heading5InputRegex = /^#####\s$/;

// Input rule: Triggers when user types "###### " at the start of a line → creates H6 heading
// Example: typing "###### Smallest heading" at start of line → converts to <h6>Smallest heading</h6>
const heading6InputRegex = /^######\s$/;

declare module "../../types" {
  interface Commands<ReturnType> {
    heading: {
      toggleHeading: ({ level }: { level: Level }) => ReturnType;
    };
  }
}

export const Heading: Extension<"heading"> = {
  name: "heading",
  nodes: {
    heading: {
      attrs: {
        level: { default: 1 },
      },
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: levels.map((level) => ({
        attrs: { level },
        tag: "h" + level,
        getAttrs: () => ({}),
      })),
      toDOM: (node) => {
        return ["h" + node.attrs.level, {}, 0];
      },
    },
  },
  commands: () => ({
    toggleHeading:
      ({ level }) =>
      ({ state, dispatch }) => {
        const headingType = state.schema.nodes.heading;
        const paragraphType = state.schema.nodes.paragraph;

        if (!headingType || !paragraphType) return false;

        const { $from } = state.selection;
        const currentNode = $from.parent;

        if (
          currentNode.type === headingType &&
          currentNode.attrs.level === level
        ) {
          return setBlockType(paragraphType)(state, dispatch);
        }

        return setBlockType(headingType, { level })(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const headingType = schema.nodes.heading;
    if (!headingType) return [];

    return levels.map((level) => {
      const regex = [
        heading1InputRegex,
        heading2InputRegex,
        heading3InputRegex,
        heading4InputRegex,
        heading5InputRegex,
        heading6InputRegex,
      ][level - 1];

      return textblockTypeInputRule({
        find: regex,
        type: headingType,
        getAttributes: () => ({ level }),
      });
    });
  },
};
