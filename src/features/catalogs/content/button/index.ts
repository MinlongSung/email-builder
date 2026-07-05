import type { BlockTemplate, ButtonBlock } from "@/features/models/types";
import { generateId } from "@/features/utils/generateId";
import { createContentTree } from "@/features/catalogs/content/utils/createContentTree";

export const buttonTemplate: BlockTemplate = {
  id: "button",

  type: "button",

  name: "Button",

  // icon: <ButtonIcon />,

  create: () => createContentTree(createButtonBlock()),
};

export interface CreateButtonBlockOptions {
  text?: string;
  props?: Partial<ButtonBlock["props"]>;
}

export function createButtonBlock({
  text = "New button",
  props,
}: CreateButtonBlockOptions = {}): ButtonBlock {
  return {
    id: generateId(),

    type: "button",

    parentId: null,

    childrenIds: [],

    props: {
      content: {
        type: "doc",
        content: [
          {
            type: "inlineContent",
            content: [
              {
                type: "text",
                text,
              },
            ],
          },
        ],
      },

      behaviour: {
        link: {
          href: "",
          type: "http",
          rel: "",
          target: "_blank",
        },
      },

      layout: {
        padding: {
          top: "12px",
          right: "24px",
          bottom: "12px",
          left: "24px",
        },
      },

      style: {
        background: {
          color: "#2563eb",
        },

        border: {
          radius: "4px",
        },

        typography: {
          color: "#ffffff",
          textDecoration: "none",
        },
      },

      ...props,
    },
  };
}
