import type { BlockEntity } from "@/entities/template";

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
      backgroundColor: "#FCD681",
      padding: "10px 20px 10px 20px",
      display: "inline-block",
      borderRadius: "30px",
      fontWeight: "normal",
      fontStyle: "normal",
      lineHeight: "120%",
      color: "#ffffff",
      textDecoration: "none !important",
      width: "auto",
    },
  },
];