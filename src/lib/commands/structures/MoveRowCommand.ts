import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { RowEntity } from "$lib/template/types";
import { Command } from "../Command";

interface MoveRowParams {
    store: TemplateStore;
    from: number;
    to: number;
}

export class MoveRowCommand extends Command {
    private store: TemplateStore;
    private from: number;
    private to: number;
    private row: RowEntity | null = null;

    constructor(params: MoveRowParams) {
        super();
        this.store = params.store;
        this.from = params.from;
        this.to = params.to;
    }

    execute() {
        const [removedRow] = this.store.template.root.rows.splice(this.from, 1);
        this.row = removedRow;

        this.store.template.root.rows.splice(this.to, 0, this.row);
        this.store.mapNodes();
    }

    undo() {
        if (!this.row) return;

        this.store.template.root.rows.splice(this.to, 1);
        this.store.template.root.rows.splice(this.from, 0, this.row);
        this.store.mapNodes();
    }
}