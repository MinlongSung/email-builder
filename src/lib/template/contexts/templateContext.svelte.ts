import { SvelteMap, SvelteSet } from "svelte/reactivity";
import { type BlockCoordinates, type BlockEntity, type BlockType, type ColumnCoordinates, type NodeEntity, type TemplateEntity } from "../types";
import { getContext, setContext } from "svelte";

export class TemplateStore {
    private _template: TemplateEntity;
    private _rowsIndex = new SvelteMap<string, number>();
    private _columnsIndex = new SvelteMap<string, ColumnCoordinates>();
    private _blocksIndex = new SvelteMap<string, BlockCoordinates>();

    constructor(template: TemplateEntity) {
        this._template = $state(template);
        this.mapNodes();
    }

    get template(): TemplateEntity {
        return this._template;
    }

    set template(template: TemplateEntity) {
        this._template = template;
    }

    mapNodes() {
        this._rowsIndex.clear();
        this._columnsIndex.clear();
        this._blocksIndex.clear();

        this.template.root.rows.forEach((row, rowIndex) => {
            this._rowsIndex.set(row.id, rowIndex);

            row.columns.forEach((col, columnIndex) => {
                this._columnsIndex.set(col.id, { rowIndex, columnIndex });

                col.blocks.forEach((block, blockIndex) => {
                    this._blocksIndex.set(block.id, { rowIndex, columnIndex, blockIndex });
                });
            });
        });
    }

    getRowCoordinates(rowId: string): number | undefined {
        return this._rowsIndex.get(rowId);
    }

    getColumnCoordinates(columnId: string): ColumnCoordinates | undefined {
        return this._columnsIndex.get(columnId);
    }

    getBlockCoordinates(blockId: string): BlockCoordinates | undefined {
        return this._blocksIndex.get(blockId);
    }

    getNode(id: string): NodeEntity | null {
        const rows = this._template.root.rows;

        const rowIndex = this.getRowCoordinates(id);
        if (rowIndex !== undefined) return rows[rowIndex];

        const colCoords = this.getColumnCoordinates(id);
        if (colCoords) return rows[colCoords.rowIndex].columns[colCoords.columnIndex];

        const blockCoords = this.getBlockCoordinates(id);
        if (blockCoords)
            return rows[blockCoords.rowIndex].columns[blockCoords.columnIndex].blocks[blockCoords.blockIndex];

        return null;
    }

    getBlocksByTypes(types: BlockType[]): Array<{ entity: BlockEntity, coordinates: BlockCoordinates }> {
        const searchedTypes = new SvelteSet(types);
        const matches = [];
        for (const [, coordinates] of this._blocksIndex.entries()) {
            const { rowIndex, columnIndex, blockIndex } = coordinates;
            const entity = this.template.root.rows[rowIndex].columns[columnIndex].blocks[blockIndex];
            if (searchedTypes.has(entity.type)) matches.push({ entity, coordinates });
        }
        return matches;
    }
}


const CONTEXT_KEY = Symbol("template");

export function setTemplateContext(getTemplate: () => TemplateEntity) {
    const templateStore = new TemplateStore(getTemplate());
    setContext(CONTEXT_KEY, templateStore);
}

export function getTemplateContext() {
    return getContext<TemplateStore>(CONTEXT_KEY);
}