import { EditorState, Transaction } from "prosemirror-state";
import { EditorView, type DirectEditorProps } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import type {
  CanCommands,
  ChainedCommands,
  EditorConfig,
  EditorContent,
  EditorEvents,
  SingleCommands,
} from "./types";

import { ExtensionManager } from "./ExtensionManager";
import { SerializerManager } from "./SerializerManager";
import { CommandManager } from "./CommandManager";
import {
  isActive as isActive,
  getAttributes as getAttributes,
} from "./helpers";
import { EventEmitter } from "./EventEmitter";
import { FocusEvents } from "./extensions/Focus";
import { Commands } from "./extensions/Commands";
import { Keymap } from "./extensions/Keymap";

export class Editor extends EventEmitter<EditorEvents> {
  private editorState: EditorState;
  private editorView: EditorView;
  private schema: Schema;
  private viewProps: Partial<DirectEditorProps> = {};
  
  public extensionManager: ExtensionManager;
  private serializerManager: SerializerManager;
  public commandManager: CommandManager;
  
  public isFocused = false;
  private config: Partial<EditorConfig>;

  constructor(config: Partial<EditorConfig> = {}) {
    super();
    this.config = config;
    if (config.onCreate) this.on("create", config.onCreate);
    if (config.onMount) this.on("mount", config.onMount);
    if (config.onUnmount) this.on("unmount", config.onUnmount);
    if (config.onUpdate) this.on("update", config.onUpdate);
    if (config.onSelectionUpdate)
      this.on("selectionUpdate", config.onSelectionUpdate);
    if (config.onTransaction) this.on("transaction", config.onTransaction);
    if (config.onFocus) this.on("focus", config.onFocus);
    if (config.onBlur) this.on("blur", config.onBlur);
    if (config.onDestroy) this.on("destroy", config.onDestroy);

    this.extensionManager = new ExtensionManager(
      [FocusEvents, Commands, Keymap, ...(this.config.extensions || [])],
      this
    );
    this.schema = this.extensionManager.schema;
    this.serializerManager = new SerializerManager(this.schema, this);
    this.commandManager = new CommandManager(this);

    this.editorState = EditorState.create({
      schema: this.schema,
      doc: this.serializerManager.parseContent(this.config.content),
      plugins: this.extensionManager.buildPlugins(),
    });

    this.editorView = new EditorView(this.config.element ?? null, {
      state: this.editorState,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      nodeViews: this.extensionManager.buildNodeViews(),
      ...this.config.viewProps,
    });

    this.emit("create", { editor: this });
  }

  private dispatchTransaction(tr: Transaction) {
    const previousState = this.editorState;
    const newState = previousState.apply(tr);

    this.editorState = newState;
    this.editorView.updateState(newState);

    this.emit("transaction", { editor: this, transaction: tr });

    if (tr.docChanged && !tr.getMeta('preventUpdate')) {
      this.emit("update", { editor: this, transaction: tr });
    }
    
    const selectionChanged = !previousState.selection.eq(newState.selection);
    if (selectionChanged) {
      this.emit("selectionUpdate", { editor: this, transaction: tr });
    }

    const focus = tr.getMeta("focus");
    const blur = tr.getMeta("blur");

    if (focus) {
      this.emit("focus", { editor: this, transaction: tr });
    }

    if (blur) {
      this.emit("blur", { editor: this, transaction: tr });
    }
  }

  public mount(element?: HTMLElement) {
    if (!element)
      throw new Error("No DOM element provided to mount the editor");

    this.editorView = new EditorView(element, {
      state: this.editorState,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      nodeViews: this.extensionManager.buildNodeViews(),
      ...this.viewProps,
    });

    this.emit("mount", { editor: this });
  }

  public unmount() {
    this.emit("unmount", { editor: this });
    this.editorView.destroy();
  }

  public destroy() {
    this.emit("destroy");
    this.unmount();
    this.removeAllListeners();
  }

  get view() {
    return this.editorView;
  }

  get state() {
    return this.editorState;
  }

  public get commands(): SingleCommands {
    return this.commandManager.commands;
  }

  public chain(): ChainedCommands {
    return this.commandManager.chain();
  }

  public can(): CanCommands {
    return this.commandManager.can();
  }

  public isActive(name: string, attributes?: Record<string, any>): boolean;
  public isActive(attributes: Record<string, any>): boolean;
  public isActive(
    nameOrAttributes: string | Record<string, any>,
    attributesOrUndefined?: Record<string, any>
  ): boolean {
    const name = typeof nameOrAttributes === "string" ? nameOrAttributes : null;
    const attributes =
      typeof nameOrAttributes === "string"
        ? attributesOrUndefined
        : nameOrAttributes;

    return isActive(this.state, name, attributes || {});
  }

  public getAttributes(name: string): Record<string, any> {
    return getAttributes(this.state, name);
  }

  public parseContent(content: EditorContent) {
    return this.serializerManager.parseContent(content);
  }

  public getJSON() {
    return this.serializerManager.getJSON();
  }

  public getHTML(): string {
    return this.serializerManager.getHTML();
  }
}
