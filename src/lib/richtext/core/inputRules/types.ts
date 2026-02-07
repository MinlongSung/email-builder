import type { MarkType, NodeType } from "prosemirror-model";
import type { EditorState, Plugin } from "prosemirror-state";
import type { ExtendedRegExpMatchArray } from "../types";

/**
 * Input rule configuration for creating or modifying nodes/marks
 */
export interface InputRuleConfig {
  /**
   * Regular expression to match against typed text
   * Should typically end with $ to match at the end of input
   */
  find: RegExp;

  /**
   * Handler function called when the pattern matches
   * Return false to prevent the rule from triggering
   */
  handler?: (
    state: EditorState,
    match: ExtendedRegExpMatchArray,
    from: number,
    to: number
  ) => boolean | null;
}

/**
 * Configuration for textblock type input rules (e.g., headings, paragraphs)
 */
export interface TextblockInputRuleConfig {
  /**
   * Regular expression to match
   * Example: /^#\s$/ for H1 headings
   */
  find: RegExp;

  /**
   * The node type to create
   */
  type: NodeType;

  /**
   * Optional attributes to set on the node
   * Can be static object or function that receives the regex match
   */
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any> | null);
}

/**
 * Configuration for mark input rules (e.g., **bold**, _italic_)
 */
export interface MarkInputRuleConfig {
  /**
   * Regular expression to match
   * Should capture the content to be marked
   * Example: /(?:^|\s)(\*\*([^*]+)\*\*)$/ for bold
   */
  find: RegExp;

  /**
   * The mark type to apply
   */
  type: MarkType;

  /**
   * Optional attributes to set on the mark
   */
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any> | null);
}

/**
 * Configuration for wrapping input rules (e.g., lists)
 */
export interface WrappingInputRuleConfig {
  /**
   * Regular expression to match
   * Example: /^\s*[-*]\s$/ for bullet lists
   */
  find: RegExp;

  /**
   * The node type to wrap content in
   */
  type: NodeType;

  /**
   * Optional attributes to set on the wrapper node
   */
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any> | null);

  /**
   * Optional join predicate - when to merge adjacent wrapped blocks
   */
  join?: (match: ExtendedRegExpMatchArray, node: any) => boolean;
}

/**
 * Paste rule configuration
 */
export interface PasteRuleConfig {
  /**
   * Regular expression to match in pasted content
   * Use 'g' flag for global matching
   */
  find: RegExp;

  /**
   * Handler function to process matches
   */
  handler: (props: {
    state: EditorState;
    match: ExtendedRegExpMatchArray;
    from: number;
    to: number;
  }) => boolean | null;
}

/**
 * Configuration for mark paste rules
 */
export interface MarkPasteRuleConfig {
  // /**
  //  * Regular expression to match
  //  * Example: /\*\*([^*]+)\*\*/g for bold
  //  */
  find: RegExp;

  /**
   * The mark type to apply
   */
  type: MarkType;

  /**
   * Optional attributes to set on the mark
   */
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any> | null);
}

/**
 * Generic rule creator function type
 */
export type RuleCreator = (config: any) => Plugin;
