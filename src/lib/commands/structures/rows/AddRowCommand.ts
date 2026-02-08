import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { RowEntity } from "$lib/template/types";
import { generateId } from "$lib/template/utils/generateId";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../../Command";

interface AddRowParams {
    store: TemplateStore;
    row: RowEntity;
    index: number;
}

export class AddRowCommand extends Command {
    private store: TemplateStore;
    private row: RowEntity;
    private index: number;

    constructor(params: AddRowParams) {
        super();
        this.store = params.store;
        this.row = this.cloneRow(params.row);
        this.index = params.index;
    }

    execute() {
        this.store.template.root.rows.splice(this.index, 0, this.row);
        this.store.mapNodes();
    }

    undo() {
        this.store.template.root.rows.splice(this.index, 1);
        this.store.mapNodes();
    }

    private cloneRow(row: RowEntity) {
        const cloned = clone(row);
        cloned.id = generateId();
        cloned.columns.forEach((column) => {
            column.id = generateId();
            column.blocks.forEach((block) => block.id = generateId());
        });

        return cloned;
    }
}