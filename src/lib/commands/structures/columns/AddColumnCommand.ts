import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { ColumnEntity } from "$lib/template/types";
import { Command } from "../../Command";

interface AddColumnParams {
    store: TemplateStore;
    rowIndex: number;
    column: ColumnEntity;
    columnIndex: number;
}

export class AddColumnCommand extends Command {
    private store: TemplateStore;
    private rowIndex: number;
    private column: ColumnEntity;
    private columnIndex: number;

    constructor(params: AddColumnParams) {
        super();
        this.store = params.store;
        this.rowIndex = params.rowIndex;
        this.column = params.column;
        this.columnIndex = params.columnIndex;
    }

    execute() {
        const row = this.store.template.root.rows[this.rowIndex];
        row.columns.splice(this.columnIndex, 0, this.column);
        this.store.mapNodes();
    }

    undo() {
        const row = this.store.template.root.rows[this.rowIndex];
        row.columns.splice(this.columnIndex, 1);
        this.store.mapNodes();
    }
}
