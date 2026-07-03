import type { EmailTemplate } from "@/features/models/types";

export const SAMPLE_TEMPLATE: EmailTemplate = {
  document: {
    rootIds: ["root-1"],

    blocks: {
      ["root-1"]: {
        id: "root-1",
        type: "root",
        parentId: null,
        childrenIds: ["row-1", "row-2"],
        props: {
          width: "600px",
          backgroundColor: "#f5f5f5",
          padding: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
        },
      },

      "row-1": {
        id: "row-1",
        type: "row",
        parentId: "root-1",
        childrenIds: ["column-1"],
        props: {
          isResponsive: true,
          padding: {
            top: "30px",
            right: "30px",
            bottom: "30px",
            left: "30px",
          },
        },
      },
      "row-2": {
        id: "row-2",
        type: "row",
        parentId: "root-1",
        childrenIds: ["column-2", "column-3"],
        props: {
          isResponsive: true,
          gap: "10px",
          padding: {
            top: "30px",
            right: "30px",
            bottom: "30px",
            left: "30px",
          },
        },
      },

      "column-2": {
        id: "column-2",
        type: "column",
        parentId: "row-2",
        childrenIds: [],
        props: {
          width: "50%",
          padding: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
        },
      },
      "column-3": {
        id: "column-3",
        type: "column",
        parentId: "row-2",
        childrenIds: [],
        props: {
          width: "50%",
          padding: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
        },
      },

      "column-1": {
        id: "column-1",
        type: "column",
        parentId: "row-1",
        childrenIds: ["text-1", "text-2", "button-1"],
        props: {
          width: "100%",
          padding: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
        },
      },

      "text-1": {
        id: "text-1",
        type: "text",
        parentId: "column-1",
        childrenIds: [],
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: {
                  level: 2,
                },
                content: [
                  {
                    type: "text",
                    text: "Welcome!",
                  },
                ],
              },
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Thanks for joining our platform. ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "We're happy to have you.",
                  },
                ],
              },
            ],
          },
        },
      },

      "text-2": {
        id: "text-2",
        type: "text",
        parentId: "column-1",
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
                    text: "este es un texto de prueba. ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "este es un subtitulo.",
                  },
                ],
              },
            ],
          },
        },
      },

      "button-1": {
        id: "button-1",
        type: "button",
        parentId: "column-1",
        childrenIds: [],
        props: {
          align: "center",
          content: {
            type: "doc",
            content: [
              {
                type: "inlineContent",
                content: [
                  {
                    type: "text",
                    text: "Get Started",
                  },
                ],
              },
            ],
          },

          link: {
            type: "http",
            url: "https://example.com",
            title: "Get Started",
          },

          backgroundColor: "red",
          color: "#ffffff",

          padding: {
            top: "12px",
            right: "24px",
            bottom: "12px",
            left: "24px",
          },

          borderRadius: {
            topLeft: "6px",
            topRight: "6px",
            bottomLeft: "6px",
            bottomRight: "6px",
          },
        },
      },
    },
  },
};
