import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { RowEntity } from "$lib/template/types";
import { generateId } from "$lib/template/utils/generateId";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../Command";

interface CloneRowParams {
    store: TemplateStore;
    sourceIndex: number;
    targetIndex: number;
}

export class CloneRowCommand extends Command {
    private store: TemplateStore;
    private sourceIndex: number;
    private targetIndex: number;
    private clonedRow: RowEntity | null = null;

    constructor(params: CloneRowParams) {
        super();
        this.store = params.store;
        this.sourceIndex = params.sourceIndex;
        this.targetIndex = params.targetIndex;
    }

    execute() {
        const sourceRow = this.store.template.root.rows[this.sourceIndex];
        this.clonedRow = this.cloneRow(sourceRow);

        this.store.template.root.rows.splice(this.targetIndex, 0, this.clonedRow);
        this.store.mapNodes();
    }

    undo() {
        if (!this.clonedRow) return;

        this.store.template.root.rows.splice(this.targetIndex, 1);
        this.store.mapNodes();
    }

    private cloneRow(row: RowEntity): RowEntity {
        const cloned = clone(row);
        cloned.id = generateId();
        cloned.columns.forEach((column) => {
            column.id = generateId();
            column.blocks.forEach((block) => block.id = generateId());
        });

        return cloned;
    }
}
