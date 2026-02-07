import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockEntity, BlockCoordinates } from "$lib/template/types";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../Command";

interface UpdateBlockParams {
    store: TemplateStore;
    coordinates: BlockCoordinates;
    updates: Partial<BlockEntity>;
}

export class UpdateBlockCommand extends Command {
    private store: TemplateStore;
    private coordinates: BlockCoordinates;
    private updates: Partial<BlockEntity>;
    private previousBlock: BlockEntity | null = null;

    constructor(params: UpdateBlockParams) {
        super();
        this.store = params.store;
        this.coordinates = params.coordinates;
        this.updates = params.updates;
    }

    execute() {
        const { rowIndex, columnIndex, blockIndex } = this.coordinates;
        const row = this.store.template.root.rows[rowIndex];
        const column = row.columns[columnIndex];
        const block = column.blocks[blockIndex];

        this.previousBlock = clone(block);

        Object.assign(block, this.updates);
    }

    undo() {
        if (!this.previousBlock) return;

        const { rowIndex, columnIndex, blockIndex } = this.coordinates;
        const row = this.store.template.root.rows[rowIndex];
        const column = row.columns[columnIndex];

        column.blocks[blockIndex] = this.previousBlock;
    }
}