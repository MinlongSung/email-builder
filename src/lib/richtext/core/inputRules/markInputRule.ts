import { Plugin } from "prosemirror-state";
import { inputRules, InputRule } from "prosemirror-inputrules";
import type { MarkInputRuleConfig } from "./types";
import type { ExtendedRegExpMatchArray } from "../types";

/**
 * Creates an input rule that applies a mark to text matching a pattern.
 *
 * @example
 * ```ts
 * // Convert "**text**" to bold
 * markInputRule({
 *   find: /(?:^|\s)(\*\*([^*]+)\*\*)$/,
 *   type: schema.marks.strong
 * })
 *
 * // Convert "_text_" to italic
 * markInputRule({
 *   find: /(?:^|\s)(_([^_]+)_)$/,
 *   type: schema.marks.em
 * })
 * ```
 *
 * @param config - Configuration object
 * @returns ProseMirror Plugin
 */
export function markInputRule(config: MarkInputRuleConfig): Plugin {
  const { find, type, getAttributes } = config;

  const rule = new InputRule(find, (state, match, start, end) => {
    const attrs =
      typeof getAttributes === "function"
        ? getAttributes(match as ExtendedRegExpMatchArray)
        : getAttributes;

    const tr = state.tr;

    // If there's a match, we need to:
    // 1. Delete the matched text (including delimiters)
    // 2. Insert the content without delimiters
    // 3. Apply the mark to the inserted content

    if (match[1]) {
      // Extract the actual content (usually in capture group 2)
      const content = match[2] || match[1];

      // Delete the matched pattern
      tr.delete(start, end);

      // Insert just the content
      tr.insertText(content, start);

      // Apply the mark to the inserted content
      tr.addMark(start, start + content.length, type.create(attrs || {}));

      return tr;
    }

    return null;
  });

  return inputRules({ rules: [rule] });
}

/**
 * Creates an input rule for marks with symmetric delimiters (e.g., **bold**)
 *
 * @example
 * ```ts
 * // **bold**
 * markInputRuleSymmetric('**', schema.marks.strong)
 *
 * // _italic_
 * markInputRuleSymmetric('_', schema.marks.em)
 * ```
 */
export function markInputRuleSymmetric(
  delimiter: string,
  markType: MarkInputRuleConfig["type"],
  getAttributes?: MarkInputRuleConfig["getAttributes"]
): Plugin {
  // Escape special regex characters
  const escaped = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Pattern: (delimiter)(content)(delimiter) at end of input
  // Example for **: /(?:^|\s)(\*\*([^*]+)\*\*)$/
  const pattern = new RegExp(
    `(?:^|\\s)(${escaped}([^${escaped[0]}]+)${escaped})$`
  );

  return markInputRule({
    find: pattern,
    type: markType,
    getAttributes,
  });
}
