import type { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
import type { EditorState, Plugin, Transaction } from "prosemirror-state";
import type {
  DirectEditorProps,
  EditorView,
  NodeViewConstructor,
} from "prosemirror-view";
import type { Editor } from "./Editor";

//#region Utils
export type KeysWithTypeOf<T, Type> = {
  [P in keyof T]: T[P] extends Type ? P : never;
}[keyof T];

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type ValuesOf<T> = T[keyof T];

//#region Commands
export interface Commands<ReturnType = boolean> {} // module augmentation

export type CommandProps = {
  editor: Editor;
  tr: Transaction;
  state: EditorState;
  view: EditorView;
  dispatch: ((args?: any) => any) | undefined;
};

export type Command = (props: CommandProps) => boolean;
export type CommandSpec = (...args: any[]) => Command;

export type UnionCommands<T = Command> = UnionToIntersection<
  ValuesOf<Pick<Commands<T>, KeysWithTypeOf<Commands<T>, object>>>
>;

export type AnyCommands = Record<string, (...args: any[]) => Command>;

export type RawCommands = {
  [Item in keyof UnionCommands]: UnionCommands<Command>[Item];
};

export type SingleCommands = {
  [Item in keyof UnionCommands]: UnionCommands<boolean>[Item];
};

export type ChainedCommands = {
  [Item in keyof UnionCommands]: UnionCommands<ChainedCommands>[Item];
} & {
  run: () => boolean;
};

export type CanCommands = SingleCommands & { chain: () => ChainedCommands };

//#region Extension
export type Extension<T extends string = string> = Omit<
  BaseExtension,
  "commands" | "name"
> & {
  name: T;
  commands?: T extends keyof Commands
    ? () => ExtensionRawCommands<T>
    : () => Record<string, CommandSpec>;
};

export type ExtensionRawCommands<T extends keyof Commands> = {
  [K in keyof Commands[T]]: Commands[T][K] extends (...args: infer Args) => any
    ? (...args: Args) => Command
    : never;
};

export interface BaseExtension {
  name: string;

  /**
   * The priority of your extension. The higher, the earlier it will be called.
   * Higher priority extensions execute first (useful for keymaps).
   * @default 100
   * @example 150 // Executes before extensions with priority 100
   */
  priority?: number;
  nodes?: Record<string, NodeSpec>;
  marks?: Record<string, MarkSpec>;
  extendNodes?: (nodes: Record<string, NodeSpec>) => Record<string, NodeSpec>;
  extendMarks?: (marks: Record<string, MarkSpec>) => Record<string, MarkSpec>;
  plugins?: (props: { schema: Schema; editor: Editor }) => Plugin[];
  inputRules?: (props: { schema: Schema; editor: Editor }) => Plugin[];
  pasteRules?: (props: { schema: Schema; editor: Editor }) => Plugin[];
  nodeViews?: () => Record<string, NodeViewConstructor>;
  commands?: () => Record<string, Command>;
  decorators?: () => Plugin[];
}

//#region Editor
export interface EditorConfig {
  element?: HTMLElement;
  content?: EditorContent;
  extensions?: Extension[];
  viewProps?: Partial<DirectEditorProps>;
  onCreate?: (props: EditorEvents["create"]) => void;
  onMount?: (props: EditorEvents["mount"]) => void;
  onUnmount?: (props: EditorEvents["unmount"]) => void;
  onTransaction?: (props: EditorEvents["transaction"]) => void;
  onUpdate?: (props: EditorEvents["update"]) => void;
  onFocus?: (props: EditorEvents["focus"]) => void;
  onBlur?: (props: EditorEvents["blur"]) => void;
  onSelectionUpdate?: (props: EditorEvents["selectionUpdate"]) => void;
  onDestroy?: (props: EditorEvents["destroy"]) => void;
}

export type EditorEvents = {
  create: { editor: Editor };
  mount: { editor: Editor };
  unmount: { editor: Editor };
  transaction: { editor: Editor; transaction: Transaction };
  update: { editor: Editor; transaction: Transaction };
  focus: { editor: Editor; transaction: Transaction };
  blur: { editor: Editor; transaction: Transaction };
  selectionUpdate: { editor: Editor; transaction: Transaction };
  destroy: void;
};

export type Range = { from: number; to: number };

export interface ExtendedRegExpMatchArray extends RegExpMatchArray {
  data?: Record<string, any>;
}

export type EditorContent = string | Record<string, unknown>;
