import type { Mark, Node, ResolvedPos } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";
import type { Level } from "./nodes/Heading";

export type NodeCoordenates = {
  node: Node;
  pos: number;
  depth: number;
};

export type SelectionContext = NodeCoordenates & {
  $pos: ResolvedPos;
  state?: EditorState;
  parent?: Node;
  mark?: Mark;
};

export type Predicate = (context: SelectionContext) => boolean;
export type NodeCallback = (context: SelectionContext, tr: Transaction) => void;

export interface TraverseOptions {
  state: EditorState;
  tr: Transaction;
  predicate: Predicate;
  callback: NodeCallback;
  from: number;
  to: number;
  includeMarks?: boolean;
}

export interface GlobalConfig {
  paragraph?: string;
  heading?: Record<Level, string>;
  link?: string;
}
