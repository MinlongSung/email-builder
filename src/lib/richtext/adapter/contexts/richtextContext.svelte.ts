import { Editor } from "$lib/richtext/core/Editor";
import { getContext, setContext } from "svelte";
import type { SelectionCoordinates } from "../types";
import { traverseInRange } from "$lib/richtext/core/extensions/utils/traverseInRange";
import type { TextContent } from "$lib/template/types";
import type { NodeCallback, Predicate } from "$lib/richtext/core/extensions/types";
import type { Extension } from "$lib/richtext/core/types";

export class RichtextStore {
    public globalEditor: Editor;
    public activeEditor = $state<Editor | null>(null);
    public selectionCoordinates = $state<SelectionCoordinates>({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
    });

    constructor(extensions: Extension[]) {
        this.globalEditor = new Editor({
            extensions,
            content: ''
        });
    }

    public applyTransform(
        content: TextContent,
        predicate: Predicate,
        callback: NodeCallback
    ): TextContent {
        this.globalEditor.commands.setContent(content.json);

        const tr = this.globalEditor.state.tr;
        traverseInRange({
            state: this.globalEditor.state,
            from: 0,
            to: this.globalEditor.state.doc.content.size,
            tr,
            predicate,
            callback,
            includeMarks: true
        });

        this.globalEditor.view.dispatch(tr);

        return {
            html: this.globalEditor.getHTML(),
            json: this.globalEditor.getJSON()
        };
    }
}

const CONTEXT_KEY = Symbol('richtext');

export function setRichtextContext(extensions: Extension[]) {
    const richtextStore = new RichtextStore(extensions);
    return setContext(CONTEXT_KEY, richtextStore);
}

export function getRichtextContext() {
    return getContext<RichtextStore>(CONTEXT_KEY);
}