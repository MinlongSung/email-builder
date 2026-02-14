import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { ColumnEntity } from "$lib/template/types";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../../Command";

interface UpdateColumnParams {
    store: TemplateStore;
    rowIndex: number;
    columnIndex: number;
    updates: Partial<ColumnEntity>;
}

export class UpdateColumnCommand extends Command {
    private store: TemplateStore;
    private rowIndex: number;
    private columnIndex: number;
    private updates: Partial<ColumnEntity>;
    private previousColumn: ColumnEntity | null = null;

    constructor(params: UpdateColumnParams) {
        super();
        this.store = params.store;
        this.rowIndex = params.rowIndex;
        this.columnIndex = params.columnIndex;
        this.updates = params.updates;
    }

    execute() {
        const column = this.store.template.root.rows[this.rowIndex].columns[this.columnIndex];
        this.previousColumn = clone(column);
        Object.assign(column, this.updates);
    }

    undo() {
        if (!this.previousColumn) return;
        this.store.template.root.rows[this.rowIndex].columns[this.columnIndex] = this.previousColumn;
    }
}
