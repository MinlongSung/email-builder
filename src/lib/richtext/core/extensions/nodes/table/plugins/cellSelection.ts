import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { CellSelection } from "prosemirror-tables";
import type { Attrs } from "prosemirror-model";

/**
 * ============================================================================ 
 * Plugin state
 * ============================================================================ 
 */
export interface CellSelectionState {
  /**
   * Common attributes of the currently selected cell(s)
   * null if not in a table cell
   */
  cellAttrs: Attrs | null;
}

export const cellSelectionPluginKey = new PluginKey<CellSelectionState>(
  "cellSelection"
);

/**
 * ============================================================================ 
 * Helper functions
 * ============================================================================ 
 */

/**
 * Get common attributes of the current selection (single or multiple cells)
 */
function getCurrentCellAttrs(view: EditorView): Attrs | null {
  const { state } = view;
  const { selection } = state;

  // --- Single cell selection ---
  const { $from } = selection;
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d);
    if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
      return { ...node.attrs };
    }
  }

  // --- Multiple cells selection ---
  if (selection instanceof CellSelection) {
    const cells: Attrs[] = [];
    selection.forEachCell((node) => {
      cells.push({ ...node.attrs });
    });

    if (cells.length === 0) return null;

    const firstCell = cells[0];

    const commonAttrs: Attrs = Object.fromEntries(
      Object.keys(firstCell)
        .filter((key) => cells.every((cell) => cell[key] === firstCell[key]))
        .map((key) => [key, firstCell[key]])
    ) as Attrs;

    return commonAttrs;
  }

  return null;
}

/**
 * Compare two attrs objects for equality
 */
function attrsEqual(a: Attrs | null, b: Attrs | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => a[key] === b[key]);
}

/**
 * ============================================================================ 
 * Plugin
 * ============================================================================ 
 */
export function cellSelectionPlugin(): Plugin<CellSelectionState> {
  return new Plugin<CellSelectionState>({
    key: cellSelectionPluginKey,

    state: {
      init(): CellSelectionState {
        return { cellAttrs: null };
      },

      apply(tr, prev): CellSelectionState {
        // Check if metadata was sent to update attrs
        const meta = tr.getMeta(cellSelectionPluginKey);
        if (meta && "cellAttrs" in meta) {
          return { cellAttrs: meta.cellAttrs };
        }

        // If selection didn't change, keep previous state
        if (!tr.selectionSet && !tr.docChanged) return prev;

        return prev;
      },
    },

    view(editorView: EditorView) {
      let lastAttrs: Attrs | null = null;
      let rafId: number | null = null;
      let destroyed = false;

      const scheduleUpdate = () => {
        if (destroyed) return;
        if (rafId !== null) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (destroyed) return;

          const newAttrs = getCurrentCellAttrs(editorView);
          if (!attrsEqual(lastAttrs, newAttrs)) {
            lastAttrs = newAttrs;

            const tr = editorView.state.tr;
            tr.setMeta(cellSelectionPluginKey, { cellAttrs: newAttrs });
            tr.setMeta("addToHistory", false);
            editorView.dispatch(tr);
          }
        });
      };

      return {
        update(view, prevState) {
          if (view.state.selection !== prevState.selection) {
            scheduleUpdate();
          }
        },

        destroy() {
          destroyed = true;
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        },
      };
    },
  });
}
