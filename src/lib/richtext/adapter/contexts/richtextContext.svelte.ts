import { Editor } from "$lib/richtext/core/Editor";
import { getContext, setContext } from "svelte";
import type { SelectionCoordinates } from "../types";

export class RichtextStore {
    public activeEditor = $state<Editor | null>(null);
    public selectionCoordinates = $state<SelectionCoordinates>({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
    });
}

const CONTEXT_KEY = Symbol('richtext');

export function setRichtextContext() {
    const richtextStore = new RichtextStore();
    return setContext(CONTEXT_KEY, richtextStore);
}

export function getRichtextContext() {
    return getContext<RichtextStore>(CONTEXT_KEY);
}