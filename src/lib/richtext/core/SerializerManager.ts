import { DOMParser, DOMSerializer, Schema } from "prosemirror-model";
import type { Editor } from "./Editor";
import type { EditorContent } from "./types";

export class SerializerManager {
  private schema: Schema;
  private editor: Editor;
  
  constructor(schema: Schema, editor: Editor) {
    this.schema = schema;
    this.editor = editor;
  }

  public parseContent(content?: EditorContent) {
    if (!content) {
      return this.schema.nodeFromJSON({
        type: "doc",
        content: [{ type: "paragraph" }],
      });
    }

    if (typeof content !== "string") {
      return this.schema.nodeFromJSON(content);
    }

    const div = document.createElement("div");
    div.innerHTML = content;
    const parser = DOMParser.fromSchema(this.schema);
    return parser.parse(div);
  }

  public getJSON() {
    return this.editor.state.doc.toJSON();
  }

  public getHTML(): string {
    const fragment = DOMSerializer.fromSchema(this.schema).serializeFragment(
      this.editor.state.doc.content
    );

    const div = document.createElement("div");
    div.appendChild(fragment);
    return div.innerHTML;
  }
}
