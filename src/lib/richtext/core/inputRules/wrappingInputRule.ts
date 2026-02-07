import { Plugin } from "prosemirror-state";
import {
  inputRules,
  wrappingInputRule as pmWrappingInputRule,
} from "prosemirror-inputrules";
import type { WrappingInputRuleConfig } from "./types";
import type { ExtendedRegExpMatchArray } from "../types";

/**
 * Creates an input rule that wraps the current textblock in a new node
 * when a pattern is matched (e.g., for creating lists).
 *
 * @example
 * ```ts
 * // Convert "- " or "* " at start of line to bullet list
 * wrappingInputRule({
 *   find: /^\s*[-*]\s$/,
 *   type: schema.nodes.bulletList
 * })
 *
 * // Convert "1. " at start of line to ordered list
 * wrappingInputRule({
 *   find: /^(\d+)\.\s$/,
 *   type: schema.nodes.orderedList,
 *   getAttributes: (match) => ({ order: parseInt(match[1], 10) })
 * })
 * ```
 *
 * @param config - Configuration object
 * @returns ProseMirror Plugin
 */
export function wrappingInputRule(config: WrappingInputRuleConfig): Plugin {
  const { find, type, getAttributes, join: joinPredicate } = config;

  const getAttrs =
    typeof getAttributes === "function"
      ? (match: RegExpMatchArray) =>
          getAttributes(match as ExtendedRegExpMatchArray)
      : getAttributes || null;

  const rule = pmWrappingInputRule(find, type, getAttrs, joinPredicate);

  return inputRules({ rules: [rule] });
}
