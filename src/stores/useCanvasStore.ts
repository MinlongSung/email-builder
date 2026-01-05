import { create } from "zustand";
import type {
  BlockEntity,
  BlockType,
  RowEntity,
  TemplateEntity,
} from "@/entities/template";

export interface ColumnCoordinates {
  rowIndex: number;
  columnIndex: number;
}

export interface BlockCoordinates extends ColumnCoordinates {
  blockIndex: number;
}

interface State {
  template: TemplateEntity | null;
  setTemplate: (template: TemplateEntity) => void;

  rowIndexMap: Map<string, number>;
  columnIndexMap: Map<string, ColumnCoordinates>;
  blockIndexMap: Map<string, BlockCoordinates>;
  blocksByTypeIndex: Map<BlockType, BlockCoordinates[]>;

  getTemplate: () => TemplateEntity | null;
  getRowCoordinates: (id: string) => number | null;
  getColumnCoordinates: (id: string) => ColumnCoordinates | null;
  getBlockCoordinates: (id: string) => BlockCoordinates | null;
  getElementById: (id: string) => BlockEntity | RowEntity | null;
  getBlocksByTypes: (types: BlockType[]) => BlockCoordinates[];
}

export const useCanvasStore = create<State>()((set, get) => ({
  template: null,
  rowIndexMap: new Map(),
  columnIndexMap: new Map(),
  blockIndexMap: new Map(),
  blocksByTypeIndex: new Map(),

  setTemplate(template: TemplateEntity) {
    const rowIndexMap = new Map<string, number>();
    const columnIndexMap = new Map<string, ColumnCoordinates>();
    const blockIndexMap = new Map<string, BlockCoordinates>();
    const blocksByTypeIndex = new Map<BlockType, BlockCoordinates[]>();

    template.rows.forEach((row, rowIndex) => {
      rowIndexMap.set(row.id, rowIndex);

      row.columns.forEach((column, columnIndex) => {
        columnIndexMap.set(column.id, { rowIndex, columnIndex });

        column.blocks.forEach((block, blockIndex) => {
          const coordinates = { rowIndex, columnIndex, blockIndex };
          blockIndexMap.set(block.id, coordinates);

          const indexByType = blocksByTypeIndex.get(block.type);
          if (indexByType) {
            indexByType.push(coordinates);
          } else {
            blocksByTypeIndex.set(block.type, [coordinates]);
          }
        });
      });
    });

    set({
      template,
      rowIndexMap,
      columnIndexMap,
      blockIndexMap,
      blocksByTypeIndex,
    });
  },

  getTemplate() {
    return get().template;
  },

  getRowCoordinates(id) {
    return get().rowIndexMap.get(id) ?? null;
  },

  getColumnCoordinates(id) {
    return get().columnIndexMap.get(id) ?? null;
  },

  getBlockCoordinates(id) {
    return get().blockIndexMap.get(id) ?? null;
  },

  getElementById(id) {
    const { template, rowIndexMap, blockIndexMap } = get();
    if (!template) return null;

    // Check if it's a row
    const rowIndex = rowIndexMap.get(id) ?? null;
    if (rowIndex !== null) {
      // Bounds check to prevent crashes if maps are out of sync
      if (rowIndex >= 0 && rowIndex < template.rows.length) {
        return template.rows[rowIndex];
      }
      console.error(`Invalid rowIndex: ${rowIndex} for id: ${id}`);
      return null;
    }

    // Check if it's a block
    const blockCoordinates = blockIndexMap.get(id) ?? null;
    if (blockCoordinates !== null) {
      // Bounds check each level to prevent crashes
      const row = template.rows[blockCoordinates.rowIndex];
      if (!row) {
        console.error(
          `Invalid rowIndex: ${blockCoordinates.rowIndex} for block id: ${id}`
        );
        return null;
      }

      const column = row.columns[blockCoordinates.columnIndex];
      if (!column) {
        console.error(
          `Invalid columnIndex: ${blockCoordinates.columnIndex} for block id: ${id}`
        );
        return null;
      }

      const block = column.blocks[blockCoordinates.blockIndex];
      if (!block) {
        console.error(
          `Invalid blockIndex: ${blockCoordinates.blockIndex} for block id: ${id}`
        );
        return null;
      }

      return block;
    }

    return null;
  },

  getBlocksByTypes: (types) => {
    const index = get().blocksByTypeIndex;
    const result: BlockCoordinates[] = [];

    for (const type of types) {
      const blocks = index.get(type);
      if (blocks) result.push(...blocks);
    }

    return result;
  },
}));
