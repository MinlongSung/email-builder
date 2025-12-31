import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

/**
 * ============================================================================
 * Plugin state
 * ============================================================================
 */

export interface TableCoordinatesState {
  /**
   * Current table's bounding rect, or null if no table is active
   */
  rect: DOMRect | null;
}

export const tableCoordinatesPluginKey = new PluginKey<TableCoordinatesState>(
  "tableCoordinates"
);

/**
 * ============================================================================
 * Helper functions
 * ============================================================================
 */

/**
 * Get the table element's bounding rect from the current selection
 */
function getTableRect(view: EditorView): DOMRect | null {
  try {
    const { state } = view;
    const { selection } = state;

    // Check if we're in a table
    const { $from } = selection;
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.spec.tableRole === "table") {
        // Found the table node, now get its DOM element
        const pos = $from.before(d);
        const domNode = view.nodeDOM(pos);

        if (domNode && domNode instanceof HTMLElement) {
          const tableElement = domNode.querySelector("table");
          if (tableElement) {
            return tableElement.getBoundingClientRect();
          }
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * ============================================================================
 * Plugin
 * ============================================================================
 */

export function tableCoordinatesPlugin(): Plugin<TableCoordinatesState> {
  return new Plugin<TableCoordinatesState>({
    key: tableCoordinatesPluginKey,

    state: {
      init(): TableCoordinatesState {
        return { rect: null };
      },

      apply(tr, prev): TableCoordinatesState {
        // Check if the plugin sent metadata with a new rect
        const meta = tr.getMeta(tableCoordinatesPluginKey);
        if (meta && "rect" in meta) {
          return { rect: meta.rect };
        }

        return prev;
      },
    },

    view(editorView: EditorView) {
      let lastRect: DOMRect | null = null;
      let rafId: number | null = null;
      let destroyed = false;

      const scheduleUpdate = () => {
        // Don't schedule if already destroyed
        if (destroyed) return;

        // Cancel any pending update
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          rafId = null;

          // Check again if destroyed before processing
          if (destroyed) return;

          try {
            const newRect = getTableRect(editorView);

            // Compare if rect actually changed
            const rectsEqual =
              (!lastRect && !newRect) ||
              (lastRect &&
                newRect &&
                lastRect.top === newRect.top &&
                lastRect.left === newRect.left &&
                lastRect.width === newRect.width &&
                lastRect.height === newRect.height);

            if (!rectsEqual) {
              lastRect = newRect;

              // Update plugin state via transaction
              const tr = editorView.state.tr;
              tr.setMeta(tableCoordinatesPluginKey, { rect: newRect });
              tr.setMeta("addToHistory", false);
              editorView.dispatch(tr);
            }
          } catch (error) {
            // Silently handle errors if editor is being destroyed
          }
        });
      };

      // Listen to window resize to recalculate coordinates
      const handleResize = () => {
        scheduleUpdate();
      };

      window.addEventListener("resize", handleResize);

      return {
        update() {
          // Schedule update on every view update
          scheduleUpdate();
        },

        destroy() {
          destroyed = true;

          // Remove resize listener
          window.removeEventListener("resize", handleResize);

          // Cancel any pending RAF
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        },
      };
    },
  });
}
