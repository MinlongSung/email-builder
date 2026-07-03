import { mergeAttributes } from "@tiptap/core";
import { isAllowedUri, Link as Original } from "@tiptap/extension-link";
import {
  buildLinkHref,
  linkToMarkAttributes,
  parseLinkHref,
} from "@/features/richtext/extensions/marks/link/utils";
import type { LinkProps } from "@/features/richtext/extensions/marks/link/utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customLink: {
      createLink: (link: LinkProps) => ReturnType;
      deleteLink: () => ReturnType;
    };
  }
}

export const Link = Original.extend({
  addAttributes() {
    return {
      type: { default: "http" },
      url: { default: null },
      title: { default: null },
      alt: { default: null },
      to: { default: null },
      subject: { default: null },
      message: { default: null },
      number: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[href]",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const href = el.getAttribute("href") ?? "";

          if (
            !href ||
            !this.options.isAllowedUri(href, {
              defaultValidate: (url) =>
                !!isAllowedUri(url, this.options.protocols),
              protocols: this.options.protocols,
              defaultProtocol: this.options.defaultProtocol,
            })
          ) {
            return false;
          }

          return parseLinkHref(href);
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const href = buildLinkHref(HTMLAttributes);

    if (
      !this.options.isAllowedUri(href, {
        defaultValidate: (url) => !!isAllowedUri(url, this.options.protocols),
        protocols: this.options.protocols,
        defaultProtocol: this.options.defaultProtocol,
      })
    ) {
      return [
        "a",
        mergeAttributes(this.options.HTMLAttributes, {
          ...HTMLAttributes,
          href: "",
        }),
        0,
      ];
    }

    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href }),
      0,
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),

      createLink:
        (link: LinkProps) =>
        ({ chain }) => {
          const attrs = linkToMarkAttributes(link);
          const href = buildLinkHref(attrs);

          if (
            !this.options.isAllowedUri(href, {
              defaultValidate: (url) =>
                !!isAllowedUri(url, this.options.protocols),
              protocols: this.options.protocols,
              defaultProtocol: this.options.defaultProtocol,
            })
          ) {
            return false;
          }

          return chain()
            .setMark(this.name, attrs)
            .setMeta("preventAutolink", true)
            .run();
        },

      deleteLink:
        () =>
        ({ chain }) =>
          chain()
            .unsetMark(this.name, { extendEmptyMarkRange: true })
            .setMeta("preventAutolink", true)
            .run(),
    };
  },
});
