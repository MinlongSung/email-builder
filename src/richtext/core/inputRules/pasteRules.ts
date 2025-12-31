import { Plugin } from "prosemirror-state";
import { Slice, Fragment } from "prosemirror-model";
import type { MarkPasteRuleConfig, PasteRuleConfig } from "./types";
import type { ExtendedRegExpMatchArray } from "../types";

/**
 * Creates a paste rule plugin that transforms pasted content based on regex patterns.
 *
 * @example
 * ```ts
 * pasteRule({
 *   find: /https?:\/\/[^\s]+/g,
 *   handler: ({ state, match, from, to }) => {
 *     const url = match[0];
 *     const link = state.schema.marks.link.create({ href: url });
 *     state.tr.addMark(from, to, link);
 *     return true;
 *   }
 * })
 * ```
 *
 * @param config - Configuration object
 * @returns ProseMirror Plugin
 */
export function pasteRule(config: PasteRuleConfig): Plugin {
  const { find, handler } = config;

  return new Plugin({
    props: {
      transformPasted(slice) {
        return slice;
      },
      handlePaste(view, _event, slice) {
        const { state } = view;

        // Process text content
        let modified = false;
        const textContent = slice.content.textBetween(
          0,
          slice.content.size,
          "\n"
        );

        let match: RegExpExecArray | null;
        while ((match = find.exec(textContent)) !== null) {
          if (
            handler({
              state,
              match: match as ExtendedRegExpMatchArray,
              from: match.index,
              to: match.index + match[0].length,
            })
          ) {
            modified = true;
          }
        }

        return modified;
      },
    },
  });
}

// /**
//  * Creates a paste rule that applies marks to matched patterns in pasted content.
//  *
//  * @example
//  * ```ts
//  * // Convert **bold** to actual bold when pasting
//  * markPasteRule({
//  *   find: /\*\*([^*]+)\*\*/g,
//  *   type: schema.marks.strong
//  * })
//  *
//  * // Convert _italic_ to actual italic when pasting
//  * markPasteRule({
//  *   find: /_([^_]+)_/g,
//  *   type: schema.marks.em
//  * })
//  * ```
//  *
//  * @param config - Configuration object
//  * @returns ProseMirror Plugin
//  */
export function markPasteRule(config: MarkPasteRuleConfig): Plugin {
  const { find, type, getAttributes } = config;

  return new Plugin({
    props: {
      transformPasted(slice, view) {
        const { schema } = view.state;

        // Process each text node in the slice
        const processNode = (node: any, pos = 0): any => {
          if (node.isText) {
            const text = node.text!;
            let lastIndex = 0;
            const fragments: any[] = [];
            let match: RegExpExecArray | null;

            // Reset regex
            find.lastIndex = 0;

            while ((match = find.exec(text)) !== null) {
              const attrs =
                typeof getAttributes === "function"
                  ? getAttributes(match as ExtendedRegExpMatchArray)
                  : getAttributes;

              // Add text before match
              if (match.index > lastIndex) {
                fragments.push(
                  schema.text(text.slice(lastIndex, match.index), node.marks)
                );
              }

              // Add matched text with mark
              const content = match[1] || match[0];
              const mark = type.create(attrs || {});
              fragments.push(schema.text(content, [...node.marks, mark]));

              lastIndex = match.index + match[0].length;
            }

            // Add remaining text
            if (lastIndex < text.length) {
              fragments.push(schema.text(text.slice(lastIndex), node.marks));
            }

            // If we found matches, return the new fragment
            if (fragments.length > 0) {
              return Fragment.from(fragments);
            }
          } else if (node.content && node.content.size > 0) {
            // Process child nodes
            const newContent: any[] = [];
            node.content.forEach((child: any, offset: number) => {
              const processed = processNode(child, pos + offset);
              if (processed instanceof Fragment) {
                processed.forEach((n: any) => newContent.push(n));
              } else {
                newContent.push(processed || child);
              }
            });

            if (newContent.length > 0) {
              return node.copy(Fragment.from(newContent));
            }
          }

          return node;
        };

        const newContent: any[] = [];
        slice.content.forEach((node: any) => {
          const processed = processNode(node);
          newContent.push(processed);
        });

        return new Slice(
          Fragment.from(newContent),
          slice.openStart,
          slice.openEnd
        );
      },
    },
  });
}

/**
 * Creates a paste rule for marks with symmetric delimiters
 *
 * @example
 * ```ts
 * // **bold** when pasting
 * markPasteRuleSymmetric('**', schema.marks.strong)
 *
 * // _italic_ when pasting
 * markPasteRuleSymmetric('_', schema.marks.em)
 * ```
 */
export function markPasteRuleSymmetric(
  delimiter: string,
  markType: MarkPasteRuleConfig["type"],
  getAttributes?: MarkPasteRuleConfig["getAttributes"]
): Plugin {
  // Escape special regex characters
  const escaped = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Pattern: (delimiter)(content)(delimiter) - global flag for paste
  const pattern = new RegExp(`${escaped}([^${escaped[0]}]+)${escaped}`, "g");

  return markPasteRule({
    find: pattern,
    type: markType,
    getAttributes,
  });
}
