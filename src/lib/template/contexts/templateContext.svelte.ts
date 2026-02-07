import { SvelteMap } from "svelte/reactivity";
import { type BlockCoordinates, type ColumnCoordinates, type TemplateEntity } from "../types";
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

    set template(t: TemplateEntity) {
        this._template = t;
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
}


const CONTEXT_KEY = Symbol("template");

export function setTemplateContext(getTemplate: () => TemplateEntity) {
    const templateStore = new TemplateStore(getTemplate());
    setContext(CONTEXT_KEY, templateStore);
}

export function getTemplateContext() {
    return getContext<TemplateStore>(CONTEXT_KEY);
}