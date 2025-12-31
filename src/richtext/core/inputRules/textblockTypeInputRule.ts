import { Plugin } from "prosemirror-state";
import {
  inputRules,
  textblockTypeInputRule as pmTextblockTypeInputRule,
} from "prosemirror-inputrules";
import type { TextblockInputRuleConfig } from "./types";
import type { ExtendedRegExpMatchArray } from "../types";

/**
 * Creates an input rule that converts a textblock to a different type
 * when a pattern is matched at the start of the block.
 *
 * @example
 * ```ts
 * // Convert "# " at start of line to H1 heading
 * textblockTypeInputRule({
 *   find: /^#\s$/,
 *   type: schema.nodes.heading,
 *   getAttributes: () => ({ level: 1 })
 * })
 * ```
 *
 * @param config - Configuration object
 * @returns ProseMirror Plugin
 */
export function textblockTypeInputRule(
  config: TextblockInputRuleConfig
): Plugin {
  const { find, type, getAttributes } = config;

  const getAttrs =
    typeof getAttributes === "function"
      ? (match: RegExpMatchArray) =>
          getAttributes(match as ExtendedRegExpMatchArray)
      : getAttributes || null;

  const rule = pmTextblockTypeInputRule(find, type, getAttrs);

  return inputRules({ rules: [rule] });
}
