import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { ColumnEntity } from "$lib/template/types";
import { Command } from "../../Command";

interface DeleteColumnParams {
    store: TemplateStore;
    rowIndex: number;
    columnIndex: number;
}

export class DeleteColumnCommand extends Command {
    private store: TemplateStore;
    private rowIndex: number;
    private columnIndex: number;
    private deletedColumn: ColumnEntity | null = null;

    constructor(params: DeleteColumnParams) {
        super();
        this.store = params.store;
        this.rowIndex = params.rowIndex;
        this.columnIndex = params.columnIndex;
    }

    execute() {
        const row = this.store.template.root.rows[this.rowIndex];
        const [removed] = row.columns.splice(this.columnIndex, 1);
        this.deletedColumn = removed;
        this.store.mapNodes();
    }

    undo() {
        if (!this.deletedColumn) return;
        const row = this.store.template.root.rows[this.rowIndex];
        row.columns.splice(this.columnIndex, 0, this.deletedColumn);
        this.store.mapNodes();
    }
}
