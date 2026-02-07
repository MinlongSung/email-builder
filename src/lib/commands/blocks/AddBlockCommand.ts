import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockEntity, BlockCoordinates } from "$lib/template/types";
import { generateId } from "$lib/template/utils/generateId";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../Command";

interface AddBlockParams {
    store: TemplateStore;
    block: BlockEntity;
    coordinates: BlockCoordinates;
}

export class AddBlockCommand extends Command {
    private store: TemplateStore;
    private block: BlockEntity;
    private coordinates: BlockCoordinates;

    constructor(params: AddBlockParams) {
        super();
        this.store = params.store;
        this.block = this.cloneBlock(params.block);
        this.coordinates = params.coordinates;
    }

    execute() {
        const { rowIndex, columnIndex, blockIndex } = this.coordinates;
        const row = this.store.template.root.rows[rowIndex];
        const column = row.columns[columnIndex];
        column.blocks.splice(blockIndex, 0, this.block);
        this.store.mapNodes();
    }

    undo() {
        const { rowIndex, columnIndex, blockIndex } = this.coordinates;
        const row = this.store.template.root.rows[rowIndex];
        const column = row.columns[columnIndex];
        column.blocks.splice(blockIndex, 1);
        this.store.mapNodes();
    }

    private cloneBlock(block: BlockEntity) {
        const cloned = clone(block);
        cloned.id = generateId();
        return cloned;
    }
}