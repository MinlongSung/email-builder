import type { BlockEntity } from "../types";

export const BLOCKS_CATALOG: BlockEntity[] = [
  {
    id: "text-template",
    type: "text",
    content: {
      html: '<p style="margin: 0px;">Texto nuevo</p>',
      json: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: {
              align: null,
              dir: null,
              paddingSide: null,
              lineHeight: null,
              margin: 0,
            },
            content: [
              {
                type: "text",
                text: "Texto nuevo",
              },
            ],
          },
        ],
      },
    },
    style: {
      fontSize: "16px",
      color: "#000000",
    },
  },
  {
    id: "button-template",
    type: "button",
    content: {
      html: " Click aquí",
      json: {
        type: "doc",
        content: [
          {
            type: "text",
            text: " Click aquí",
          },
        ],
      },
    },
    style: {
      ["background-color"]: "#FCD681",
      padding: "10px 20px 10px 20px",
      display: "inline-block",
      ["border-radius"]: "30px",
      ["font-weight"]: "normal",
      ["font-style"]: "normal",
      ["line-height"]: "120%",
      color: "#ffffff",
      ["text-decoration"]: "none !important",
      width: "auto",
    },
  },
];
