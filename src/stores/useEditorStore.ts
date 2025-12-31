import { create } from "zustand";
import type { TemplateEntity } from "@/entities/template";

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

  getRowCoordinates: (id: string) => number | null;
  getColumnCoordinates: (id: string) => ColumnCoordinates | null;
  getBlockCoordinates: (id: string) => BlockCoordinates | null;
}

export const useEditorStore = create<State>()((set, get) => ({
  template: null,
  rowIndexMap: new Map(),
  columnIndexMap: new Map(),
  blockIndexMap: new Map(),

  setTemplate(template: TemplateEntity) {
    const rowIndexMap = new Map<string, number>();
    const columnIndexMap = new Map<
      string,
      { rowIndex: number; columnIndex: number }
    >();
    const blockIndexMap = new Map<
      string,
      { rowIndex: number; columnIndex: number; blockIndex: number }
    >();

    template.rows.forEach((row, rowIndex) => {
      rowIndexMap.set(row.id, rowIndex);

      row.columns.forEach((column, columnIndex) => {
        columnIndexMap.set(column.id, { rowIndex, columnIndex });

        column.blocks.forEach((block, blockIndex) => {
          blockIndexMap.set(block.id, { rowIndex, columnIndex, blockIndex });
        });
      });
    });

    set({ template, rowIndexMap, columnIndexMap, blockIndexMap });
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
}));
