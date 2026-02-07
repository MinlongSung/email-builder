import { Editor } from "$lib/richtext/core/Editor";
import { getContext, setContext } from "svelte";
import type { SelectionCoordinates } from "../types";

export class RichtextStore {
    private _activeEditor = $state<Editor | null>(null);
    private _selectionCoordinates = $state<SelectionCoordinates>({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
    });

    get activeEditor(): Editor | null {
        return this._activeEditor;
    }

    set activeEditor(editor: Editor) {
        this._activeEditor = editor;
    }

    get selectionCoordinates(): SelectionCoordinates {
        return this._selectionCoordinates;
    }

    set selectionCoordenates(coordinates: SelectionCoordinates) {
        this._selectionCoordinates = coordinates;
    }
}

const CONTEXT_KEY = Symbol('richtext');

export function setRichtextContext() {
    const richtextStore = new RichtextStore();
    return setContext(CONTEXT_KEY, richtextStore);
}

export function getRichtextContext() {
    return getContext<RichtextStore>(CONTEXT_KEY);
}