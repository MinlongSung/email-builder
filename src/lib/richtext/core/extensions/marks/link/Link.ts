import type { Extension } from "../../../types";
import { linkHighlight } from "../../../extensions/marks/link/plugins/LinkHighlight";
import { markInputRule } from "../../../inputRules/markInputRule";
import { markPasteRule } from "../../../inputRules/pasteRules";
import { type Protocol } from "../../../extensions/marks/link/types";
import { traverseInRange } from "../../../extensions/utils/traverseInRange";
import { isLink } from "../../../extensions/marks/link/utils/isLink";

export const Protocols: Protocol[] = ["https", "mailto", "tel", "ftp"];

// Input rule: Triggers when user types [text](url) followed by space
// Example: "[Click here](https://example.com) " → creates link
const linkInputRegex = /(?:^|\s)\[([^\]]+)\]\(([^)]+)\)$/;

// Paste rule: Matches URLs in pasted content (http, https, www)
// Example: pasting "Visit https://example.com for more" → auto-links the URL
const linkPasteRegex =
  /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/g;

declare module "../../../types" {
  interface Commands<ReturnType> {
    link: {
      setLink: (options: { href: string; title?: string }) => ReturnType;
      unsetLink: () => ReturnType;
    };
  }
}

export const Link = (config: {
  isUnderlined?: boolean;
}): Extension<"link"> => ({
  name: "link",
  marks: {
    link: {
      attrs: {
        href: { default: "" },
        target: { default: "_blank" },
        rel: { default: "noopener noreferrer" },
        title: { default: null },
        isUnderlined: { default: config.isUnderlined ?? true },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs: (dom) => ({
            href: dom.getAttribute("href"),
            target: dom.getAttribute("target") || "_blank",
            rel: dom.getAttribute("rel") || "noopener noreferrer",
            title: dom.getAttribute("title") || null,
            isUnderlined: dom.style.textDecoration !== "none",
          }),
        },
      ],
      toDOM: (mark) => [
        "a",
        {
          href: mark.attrs.href,
          target: mark.attrs.target,
          rel: mark.attrs.rel,
          title: mark.attrs.title || undefined,
          style: !mark.attrs.isUnderlined ? "text-decoration: none" : undefined,
        },
        0,
      ],
    },
  },
  commands: () => ({
    setLink:
      (options) =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.link;

        if (!markType) return false;

        if (empty) return false;

        if (dispatch) {
          const attrs = {
            href: options.href,
            target: "_blank",
            rel: "noopener noreferrer",
            title: options.title || null,
          };

          tr.addMark(from, to, markType.create(attrs));
          dispatch(tr);
        }

        return true;
      },
    unsetLink:
      () =>
      ({ state, dispatch, tr }) => {
        const { from, to, empty } = state.selection;
        const markType = state.schema.marks.link;

        if (!markType) return false;

        if (!empty) {
          tr.removeMark(from, to, markType);
          dispatch?.(tr);
          return true;
        }

        let changed = false;
        traverseInRange({
          state,
          tr,
          from,
          to,
          includeMarks: true,
          predicate: ({ mark }) => isLink(mark),
          callback: ({ mark, node, pos }) => {
            if (mark) {
              const start = pos;
              const end = pos + node.nodeSize;
              if (node.attrs.link !== null) {
                tr.removeMark(start, end, markType);
                changed = true;
              }
            }
          },
        });

        if (changed) dispatch?.(tr);
        return changed;
      },
  }),

  decorators: () => {
    return [linkHighlight()];
  },

  inputRules: ({ schema }) => {
    const linkMark = schema.marks.link;
    if (!linkMark) return [];

    return [
      markInputRule({
        find: linkInputRegex,
        type: linkMark,
        getAttributes: (match) => {
          const text = match[1]; // El texto entre corchetes
          const url = match[2]; // La URL entre paréntesis
          return {
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
            title: text,
          };
        },
      }),
    ];
  },

  pasteRules: ({ schema }) => {
    const linkMark = schema.marks.link;
    if (!linkMark) return [];

    return [
      markPasteRule({
        find: linkPasteRegex,
        type: linkMark,
        getAttributes: (match) => ({
          href: match[1], // La URL completa
          target: "_blank",
          rel: "noopener noreferrer",
        }),
      }),
    ];
  },
});
