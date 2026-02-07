import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockEntity, BlockCoordinates } from "$lib/template/types";
import { Command } from "../Command";

interface MoveBlockParams {
    store: TemplateStore;
    from: BlockCoordinates;
    to: BlockCoordinates;
}

export class MoveBlockCommand extends Command {
    private store: TemplateStore;
    private from: BlockCoordinates;
    private to: BlockCoordinates;
    private block: BlockEntity | null = null;

    constructor(params: MoveBlockParams) {
        super();
        this.store = params.store;
        this.from = params.from;
        this.to = params.to;
    }

    execute() {
        const fromRow = this.store.template.root.rows[this.from.rowIndex];
        const fromColumn = fromRow.columns[this.from.columnIndex];
        const [removedBlock] = fromColumn.blocks.splice(this.from.blockIndex, 1);
        this.block = removedBlock;

        const toRow = this.store.template.root.rows[this.to.rowIndex];
        const toColumn = toRow.columns[this.to.columnIndex];
        toColumn.blocks.splice(this.to.blockIndex, 0, this.block);

        this.store.mapNodes();
    }

    undo() {
        if (!this.block) return;

        const toRow = this.store.template.root.rows[this.to.rowIndex];
        const toColumn = toRow.columns[this.to.columnIndex];
        toColumn.blocks.splice(this.to.blockIndex, 1);

        const fromRow = this.store.template.root.rows[this.from.rowIndex];
        const fromColumn = fromRow.columns[this.from.columnIndex];
        fromColumn.blocks.splice(this.from.blockIndex, 0, this.block);

        this.store.mapNodes();
    }
}