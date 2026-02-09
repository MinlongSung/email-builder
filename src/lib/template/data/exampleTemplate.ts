import type { TemplateEntity } from "../types";

export const exampleTemplate: TemplateEntity = {
    config: {
        paragraph: {
            color: 'red'
        },
        heading: {
            level: {
                2: {
                    color: 'blue'
                }
            }
        }
    },
    root: {
        id: "root",
        type: "root",
        width: 550,
        style: { padding: "0px" },
        rows: [
            {
                id: "row-1",
                type: "row",
                style: {
                    padding: "20px",
                },
                separatorSize: 10,
                isResponsive: true,
                columns: [
                    {
                        id: "col-1-1",
                        width: 50,
                        style: {
                            ["padding-right"]: "10px",
                        },
                        type: "column",
                        blocks: [
                            {
                                id: "block-uid-1",
                                type: "text",
                                content: {
                                    html: '<p>Te<s>xto en el seg</s>undo <strong>td <u>del</u></strong><u> blo</u>ck-4</p>',
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
                                                        text: "Te",
                                                    },
                                                    {
                                                        type: "text",
                                                        marks: [
                                                            {
                                                                type: "strike",
                                                            },
                                                        ],
                                                        text: "xto en el seg",
                                                    },
                                                    {
                                                        type: "text",
                                                        text: "undo ",
                                                    },
                                                    {
                                                        type: "text",
                                                        marks: [
                                                            {
                                                                type: "bold",
                                                            },
                                                        ],
                                                        text: "td ",
                                                    },
                                                    {
                                                        type: "text",
                                                        marks: [
                                                            {
                                                                type: "bold",
                                                            },
                                                            {
                                                                type: "underline",
                                                            },
                                                        ],
                                                        text: "del",
                                                    },
                                                    {
                                                        type: "text",
                                                        marks: [
                                                            {
                                                                type: "underline",
                                                            },
                                                        ],
                                                        text: " blo",
                                                    },
                                                    {
                                                        type: "text",
                                                        text: "ck-4",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                style: {},
                            },
                            {
                                id: "block-uid-2",
                                type: "text",
                                content: {
                                    html: '<p>Text<span style="color: #26f23e;">o en el seg</span>undo td weee</p>',
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
                                                        text: "Text",
                                                    },
                                                    {
                                                        type: "text",
                                                        text: "o en el seg",
                                                        marks: [
                                                            {
                                                                type: "color",
                                                                attrs: {
                                                                    color: "#26f23e",
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        type: "text",
                                                        text: "undo td weee",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                style: {},
                            },
                        ],
                    },
                    {
                        id: "col-1-2",
                        width: 50,
                        type: "column",
                        style: {
                            ["padding-left"]: "10px",
                        },
                        blocks: [],
                    },
                ],
            },

            // Fila 2 - 3 columnas
            {
                id: "row-2",
                type: "row",
                style: {
                    padding: "20px",
                },
                separatorSize: 10,
                isResponsive: true,
                columns: [
                    {
                        id: "col-2-1",
                        width: 33,
                        style: { ["paddin-right"]: "10px" },
                        type: "column",
                        blocks: [
                            {
                                id: "block-uid-3",
                                type: "button",
                                content: {
                                    html: "Haz clic aquí",
                                    json: {
                                        type: "doc",
                                        content: [
                                            {
                                                type: "text",
                                                text: "Haz clic aquí",
                                            },
                                        ],
                                    },
                                },
                                style: {
                                    ["background-color"]: "#ff0000",
                                    padding: "10px 20px 10px 20px",
                                    display: "inline-block",
                                    ["border-radius"]: "30px 30px 30px 30px",
                                    ["font-weight"]: "normal",
                                    ["font-style"]: "normal",
                                    ["line-height"]: "120%",
                                    color: "#ffffff",
                                    ["text-decoration"]: "none",
                                    width: "auto",
                                },
                            },
                        ],
                    },
                    {
                        id: "col-2-2",
                        type: "column",
                        width: 33,
                        style: { padding: "0 5px" },
                        blocks: [],
                    },
                    {
                        id: "col-2-3",
                        type: "column",
                        width: 34,
                        style: { ["padding-left"]: "10px" },
                        blocks: [],
                    },
                ],
            },

        ],
    },
};
