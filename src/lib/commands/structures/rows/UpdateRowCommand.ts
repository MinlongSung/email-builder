import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { RowEntity } from "$lib/template/types";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../../Command";

interface UpdateRowParams {
    store: TemplateStore;
    rowIndex: number;
    updates: Partial<RowEntity>;
}

export class UpdateRowCommand extends Command {
    private store: TemplateStore;
    private rowIndex: number;
    private updates: Partial<RowEntity>;
    private previousRow: RowEntity | null = null;

    constructor(params: UpdateRowParams) {
        super();
        this.store = params.store;
        this.rowIndex = params.rowIndex;
        this.updates = params.updates;
    }

    execute() {
        const row = this.store.template.root.rows[this.rowIndex];
        this.previousRow = clone(row);
        Object.assign(row, this.updates);
    }

    undo() {
        if (!this.previousRow) return;
        this.store.template.root.rows[this.rowIndex] = this.previousRow;
    }
}
