/**
 * Input and Paste Rules System
 *
 * This module provides reusable utilities for creating input rules (triggered while typing)
 * and paste rules (triggered when pasting content) in ProseMirror.
 *
 * Exports:
 * - textblockTypeInputRule: Create input rules for block-level elements
 * - markInputRule: Create input rules for inline marks
 * - wrappingInputRule: Create input rules for wrapping blocks
 * - pasteRule: Create rules for paste handling
 * - markPasteRule: Create paste rules for marks
 *
 * @module inputRules
 */

// Input Rules
export { textblockTypeInputRule } from "./textblockTypeInputRule";
export { markInputRule, markInputRuleSymmetric } from "./markInputRule";
export { wrappingInputRule } from "./wrappingInputRule";

// Paste Rules
export {
  pasteRule,
  markPasteRule,
  markPasteRuleSymmetric,
} from "./pasteRules";

// Types
export type {
  InputRuleConfig,
  TextblockInputRuleConfig,
  MarkInputRuleConfig,
  WrappingInputRuleConfig,
  PasteRuleConfig,
  MarkPasteRuleConfig,
  RuleCreator,
} from "./types";
