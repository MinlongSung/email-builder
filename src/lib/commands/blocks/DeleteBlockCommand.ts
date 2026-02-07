import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockEntity, BlockCoordinates } from "$lib/template/types";
import { Command } from "../Command";

interface DeleteBlockParams {
    store: TemplateStore;
    coordinates: BlockCoordinates;
}

export class DeleteBlockCommand extends Command {
    private store: TemplateStore;
    private coordinates: BlockCoordinates;
    private deletedBlock: BlockEntity | null = null;

    constructor(params: DeleteBlockParams) {
        super();
        this.store = params.store;
        this.coordinates = params.coordinates;
    }

    execute() {
        const row = this.store.template.root.rows[this.coordinates.rowIndex];
        const column = row.columns[this.coordinates.columnIndex];
        const [block] = column.blocks.splice(this.coordinates.blockIndex, 1);
        this.deletedBlock = block;
        this.store.mapNodes();
    }

    undo() {
        if (!this.deletedBlock) return;

        const row = this.store.template.root.rows[this.coordinates.rowIndex];
        const column = row.columns[this.coordinates.columnIndex];
        column.blocks.splice(this.coordinates.blockIndex, 0, this.deletedBlock);
        this.store.mapNodes();
    }
}
