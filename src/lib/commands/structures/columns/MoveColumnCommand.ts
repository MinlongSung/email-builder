import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { ColumnEntity } from "$lib/template/types";
import { Command } from "../../Command";

interface MoveColumnParams {
    store: TemplateStore;
    rowIndex: number;
    from: number;
    to: number;
}

export class MoveColumnCommand extends Command {
    private store: TemplateStore;
    private rowIndex: number;
    private from: number;
    private to: number;
    private column: ColumnEntity | null = null;

    constructor(params: MoveColumnParams) {
        super();
        this.store = params.store;
        this.rowIndex = params.rowIndex;
        this.from = params.from;
        this.to = params.to;
    }

    execute() {
        const row = this.store.template.root.rows[this.rowIndex];
        const [removedColumn] = row.columns.splice(this.from, 1);
        this.column = removedColumn;

        row.columns.splice(this.to, 0, this.column);
        this.store.mapNodes();
    }

    undo() {
        if (!this.column) return;

        const row = this.store.template.root.rows[this.rowIndex];
        row.columns.splice(this.to, 1);
        row.columns.splice(this.from, 0, this.column);
        this.store.mapNodes();
    }
}
