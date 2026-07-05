import type { BlockTemplate, TextBlock } from "@/features/models/types";
import { generateId } from "@/features/utils/generateId";
import { createContentTree } from "@/features/catalogs/content/utils/createContentTree";

export const textTemplate: BlockTemplate = {
  id: "text",

  type: "text",

  name: "Text",

  // icon: <TextIcon />,

  create: () => createContentTree(createTextBlock()),
};

export interface CreateTextBlockOptions {
  text?: string;
  props?: Partial<TextBlock["props"]>;
}

export function createTextBlock({
  text = "New text",
  props,
}: CreateTextBlockOptions = {}): TextBlock {
  return {
    id: generateId(),

    type: "text",

    parentId: null,

    childrenIds: [],

    props: {
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text,
              },
            ],
          },
        ],
      },

      layout: {},

      style: {},

      ...props,
    },
  };
}
