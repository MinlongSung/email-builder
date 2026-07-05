import type { EmailTemplate } from "@/features/models/types";

export const SAMPLE_TEMPLATE: EmailTemplate = {
  document: {
    rootIds: ["root-1"],

    blocks: {
      "root-1": {
        id: "root-1",
        type: "root",
        parentId: null,
        childrenIds: ["row-1", "row-2", "row-3"],

        props: {
          layout: {
            maxWidth: "600px",
            padding: "30px",
          },

          style: {
            background: {
              color: "#f5f5f5",
            },
          },
        },
      },

      "row-1": {
        id: "row-1",
        type: "row",
        parentId: "root-1",
        childrenIds: ["column-1"],

        props: {
          layout: {
            padding: "30px",
          },

          responsive: {
            mobile: {
              stack: true,
            },
          },
        },
      },

      "row-2": {
        id: "row-2",
        type: "row",
        parentId: "root-1",
        childrenIds: ["column-2", "column-3"],

        props: {
          layout: {
            gap: "10px",
            padding: "30px",
          },

          responsive: {
            mobile: {
              stack: true,
            },
          },
        },
      },

      "column-1": {
        id: "column-1",
        type: "column",
        parentId: "row-1",
        childrenIds: ["text-1", "text-2", "button-1"],

        props: {
          layout: {
            width: "100%",
            padding: "30px",
          },
        },
      },

      "column-2": {
        id: "column-2",
        type: "column",
        parentId: "row-2",
        childrenIds: [],

        props: {
          layout: {
            width: "50%",
            padding: "30px",
          },
        },
      },

      "column-3": {
        id: "column-3",
        type: "column",
        parentId: "row-2",
        childrenIds: [],

        props: {
          layout: {
            width: "50%",
            padding: "30px",
          },
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
                    text: "We're happy to have you.",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          layout: {
            margin: {
              bottom: "20px",
            },
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
                    text: "Este es un texto de prueba. ",
                  },
                  {
                    type: "text",
                    text: "Este es un subtítulo.",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          layout: {
            margin: {
              bottom: "24px",
            },
          },
        },
      },

      "button-1": {
        id: "button-1",
        type: "button",
        parentId: "column-1",
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
                    text: "Get Started",
                  },
                ],
              },
            ],
          },

          layout: {
            align: "center",

            padding: {
              top: "12px",
              right: "24px",
              bottom: "12px",
              left: "24px",
            },
          },

          style: {
            background: {
              color: "#ff0000",
            },

            border: {
              radius: "6px",
            },

            typography: {
              color: "#ffffff",
              textDecoration: "none"
            },
          },


          behaviour: {
            link: {
              type: "http",
              href: "https://example.com",
              title: "Get Started",
              target: "_blank",
            },
          },
        },
      },

      "row-3": {
        id: "row-3",
        type: "row",
        parentId: "root-1",
        childrenIds: ["column-4", "column-5"],

        props: {
          layout: {
            gap: "10px",
            padding: "30px",
          },

          responsive: {
            mobile: {
              stack: true,
            },
          },
        },
      },

      "column-4": {
        id: "column-4",
        type: "column",
        parentId: "row-3",
        childrenIds: [],

        props: {
          layout: {
            width: "100%",
            padding: "30px",
          },
        },
      },


      "column-5": {
        id: "column-5",
        type: "column",
        parentId: "row-3",
        childrenIds: [],

        props: {
          layout: {
            width: "50%",
            padding: "30px",
          },
        },
      },
    },
  },
};