import type { Node } from "prosemirror-model";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";

export const insertTable =
  (rows = 3, cols = 3) =>
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const columnWidth = 100 / cols;

    // Crear filas y celdas
    const rowNodes: Node[] = [];
    for (let r = 0; r < rows; r++) {
      const cells: Node[] = [];
      for (let c = 0; c < cols; c++) {
        const cell = state.schema.nodes.tableCell.createAndFill({
          colwidth: [columnWidth],
        });
        if (!cell) continue;
        cells.push(cell);
      }
      rowNodes.push(state.schema.nodes.tableRow.create(null, cells));
    }

    // Crear la tabla
    const table = state.schema.nodes.table.create(
      { tableWidth: "100%" },
      rowNodes
    );

    if (dispatch) {
      // Guardar posición ANTES de insertar la tabla
      const insertPos = state.selection.from;

      const tr = state.tr.replaceSelectionWith(table);

      // Calcular posición de la primera celda:
      // insertPos + 1 (dentro de table) + 1 (dentro de primera row) + 1 (dentro de primera cell)
      const firstCellPos = insertPos + 3;
      const $pos = tr.doc.resolve(firstCellPos);

      tr.setSelection(TextSelection.near($pos));

      dispatch(tr);
    }

    return true;
  };
