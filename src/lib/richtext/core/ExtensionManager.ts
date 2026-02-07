import { Schema, type MarkSpec, type NodeSpec } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { NodeViewConstructor } from "prosemirror-view";
import type { Editor } from "./Editor";
import type { Extension, RawCommands } from "./types";
import { sortExtensions } from "./helpers";

export class ExtensionManager {
  public editor: Editor;
  public schema: Schema;
  public extensions: Extension[];

  constructor(extensions: Extension[], editor: Editor) {
    this.editor = editor;
    this.extensions = sortExtensions(extensions);
    this.schema = this.buildSchema();
  }

  get commands(): RawCommands {
    const allCommands = {};

    this.extensions.forEach((ext) => {
      if (!ext.commands) return;
      const extCommands = ext.commands();
      Object.assign(allCommands, extCommands);
    });

    return allCommands as RawCommands;
  }

  buildSchema(): Schema {
    const nodes: Record<string, NodeSpec> = {};
    const marks: Record<string, MarkSpec> = {};

    this.extensions.forEach((ext) => {
      if (ext.nodes) Object.assign(nodes, ext.nodes);
      if (ext.marks) Object.assign(marks, ext.marks);
    });

    this.extensions.forEach((ext) => {
      if (ext.extendNodes) Object.assign(nodes, ext.extendNodes(nodes));
      if (ext.extendMarks) Object.assign(marks, ext.extendMarks(marks));
    });

    return new Schema({ nodes, marks });
  }

  buildPlugins(): Plugin[] {
    const plugins: Plugin[] = [];

    // Los plugins se agregan en orden de prioridad (ya ordenados)
    // ProseMirror ejecuta plugins en orden: primero en el array = primero en ejecutarse
    const extensionProps = { schema: this.schema, editor: this.editor };
    this.extensions.forEach((ext) => {
      if (ext.plugins) plugins.push(...ext.plugins(extensionProps));
      if (ext.inputRules) plugins.push(...ext.inputRules(extensionProps));
      if (ext.pasteRules) plugins.push(...ext.pasteRules(extensionProps));
      if (ext.decorators) plugins.push(...ext.decorators());
    });

    return plugins;
  }

  buildNodeViews(): Record<string, NodeViewConstructor> {
    const nodeViews: Record<string, NodeViewConstructor> = {};

    this.extensions.forEach((ext) => {
      if (ext.nodeViews) {
        Object.assign(nodeViews, ext.nodeViews());
      }
    });

    return nodeViews;
  }
}
