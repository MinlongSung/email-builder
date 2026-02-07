import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockEntity, BlockCoordinates } from "$lib/template/types";
import { generateId } from "$lib/template/utils/generateId";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../Command";

interface CloneBlockParams {
    store: TemplateStore;
    sourceCoordinates: BlockCoordinates;
    targetCoordinates: BlockCoordinates;
}

export class CloneBlockCommand extends Command {
    private store: TemplateStore;
    private sourceCoordinates: BlockCoordinates;
    private targetCoordinates: BlockCoordinates;
    private clonedBlock: BlockEntity | null = null;

    constructor(params: CloneBlockParams) {
        super();
        this.store = params.store;
        this.sourceCoordinates = params.sourceCoordinates;
        this.targetCoordinates = params.targetCoordinates;
    }

    execute() {
        const sourceRow = this.store.template.root.rows[this.sourceCoordinates.rowIndex];
        const sourceColumn = sourceRow.columns[this.sourceCoordinates.columnIndex];
        const sourceBlock = sourceColumn.blocks[this.sourceCoordinates.blockIndex];

        this.clonedBlock = this.cloneBlock(sourceBlock);

        const targetRow = this.store.template.root.rows[this.targetCoordinates.rowIndex];
        const targetColumn = targetRow.columns[this.targetCoordinates.columnIndex];
        targetColumn.blocks.splice(this.targetCoordinates.blockIndex, 0, this.clonedBlock);

        this.store.mapNodes();
    }

    undo() {
        if (!this.clonedBlock) return;

        const targetRow = this.store.template.root.rows[this.targetCoordinates.rowIndex];
        const targetColumn = targetRow.columns[this.targetCoordinates.columnIndex];
        targetColumn.blocks.splice(this.targetCoordinates.blockIndex, 1);

        this.store.mapNodes();
    }

    private cloneBlock(block: BlockEntity): BlockEntity {
        const cloned = clone(block);
        cloned.id = generateId();
        return cloned;
    }
}
