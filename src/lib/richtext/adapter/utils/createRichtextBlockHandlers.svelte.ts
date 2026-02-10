import type { Editor } from "$lib/richtext/core/Editor";
import { tick } from "svelte";
import { getRichtextContext } from "../contexts/richtextContext.svelte";
import { createSubscriber } from "svelte/reactivity";
import { HistoryService } from "$lib/history/HistoryService.svelte";
import type { EditorContent } from "$lib/richtext/core/types";
import type { Transaction } from "prosemirror-state";

interface RichtextBlockHandlersOptions {
    getContent: () => EditorContent;
    onUpdate: (editor: Editor, transaction: Transaction) => void;
    historyService: HistoryService;
}

export function createRichtextBlockHandlers(options: RichtextBlockHandlersOptions) {
    const richtextContext = getRichtextContext();
    const { historyService, getContent, onUpdate } = options;

    const syncContent = async () => {
        await tick();
        const content = getContent();
        richtextContext.activeEditor?.commands.setContent(content, { emitUpdate: false });
    };

    const handleCreate = (editor: Editor) => {
        const { start, end } = richtextContext.selectionCoordinates;
        const from = editor.view.posAtCoords({ left: start.x, top: start.y })?.pos;
        const to = editor.view.posAtCoords({ left: end.x, top: end.y })?.pos;
        if (from && to) editor.commands.setTextSelection({ from, to });
        editor.commands.focus();

        const subscribe = createSubscriber((update) => {
            editor.on('transaction', update);
            return () => editor.off('transaction', update);
        });

        richtextContext.activeEditor = new Proxy(editor, {
            get(editor, property, receiver) {
                subscribe();
                return Reflect.get(editor, property, receiver);
            }
        });

        historyService.on('undo', syncContent);
        historyService.on('redo', syncContent);
        historyService.on('goto', syncContent);
    };

    const handleUpdate = (editor: Editor, transaction: Transaction) => {
        onUpdate(editor, transaction);
    };

    const handleDestroy = () => {
        historyService.off('undo', syncContent);
        historyService.off('redo', syncContent);
        historyService.off('goto', syncContent);
        richtextContext.activeEditor = null;
    };

    return {
        handleCreate,
        handleUpdate,
        handleDestroy
    };
}