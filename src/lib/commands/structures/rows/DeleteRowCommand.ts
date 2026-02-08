import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { RowEntity } from "$lib/template/types";
import { Command } from "../../Command";

interface DeleteRowParams {
    store: TemplateStore;
    index: number;
}

export class DeleteRowCommand extends Command {
    private store: TemplateStore;
    private index: number;
    private row: RowEntity | null = null;

    constructor(params: DeleteRowParams) {
        super();
        this.store = params.store;
        this.index = params.index;
    }

    execute() {
        const [row] = this.store.template.root.rows.splice(this.index, 1);
        this.row = row;
        this.store.mapNodes();
    }

    undo() {
        if (!this.row) return;

        this.store.template.root.rows.splice(this.index, 0, this.row);
        this.store.mapNodes();
    }
}
