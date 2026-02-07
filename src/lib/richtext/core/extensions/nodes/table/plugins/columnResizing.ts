import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { TableMap } from "prosemirror-tables";
import { Decoration, DecorationSet, type EditorView } from "prosemirror-view";
import type { ResolvedPos } from "prosemirror-model";
import { getColumnWidths } from "../utils/getColumnWidths";
import { calculateResizedWidths } from "../utils/calculateResizedWidths";

/**
 * ============================================================================
 * Options & constants
 * ============================================================================
 */

export interface PercentageResizingOptions {
  handleWidth?: number;
  minColumnWidthPercent?: number;
}

export const DEFAULT_HANDLE_WIDTH = 5;
export const DEFAULT_MIN_COLUMN_WIDTH_PERCENT = 5;

export const percentageColumnResizingPluginKey =
  new PluginKey<ResizingPluginState>("percentageColumnResizing");

/**
 * ============================================================================
 * Plugin state
 * ============================================================================
 */

/**
 * Represents an active column drag operation
 */
export interface DragState {
  /** Initial pointer X position */
  startX: number;

  /** Column widths at drag start (percentages) */
  startWidths: number[];

  /** Table width in pixels */
  tableWidth: number;

  /** Column index being resized */
  col: number;
}

/**
 * Plugin internal state
 */
export interface ResizingPluginState {
  /**
   * Position of the cell whose edge is currently active
   * -1 means no active resize handle
   */
  activeHandle: number;

  /**
   * Current drag state, or null if not dragging
   */
  dragging: DragState | null;
}

/**
 * ============================================================================
 * DOM helpers
 * ============================================================================
 */

/**
 * Find the closest TD or TH element from an event target.
 * Stops if we hit the ProseMirror container.
 */
function domCellAround(
  target: EventTarget | null
): HTMLTableCellElement | null {
  while (target && target instanceof HTMLElement) {
    if (target.nodeName === "TD" || target.nodeName === "TH") {
      return target as HTMLTableCellElement;
    }

    if (target.classList.contains("ProseMirror")) return null;

    target = target.parentNode;
  }
  return null;
}

/**
 * Find the cell around a resolved position.
 */
function cellAround(pos: ResolvedPos): ResolvedPos | null {
  for (let d = pos.depth - 1; d > 0; d--) {
    if (pos.node(d).type.spec.tableRole === "row") {
      return pos.node(0).resolve(pos.before(d + 1));
    }
  }
  return null;
}

/**
 * Check if position points at a cell
 */
function pointsAtCell($pos: ResolvedPos): boolean {
  return $pos.parent.type.spec.tableRole === "row" && !!$pos.nodeAfter;
}

/**
 * ============================================================================
 * Handle detection
 * ============================================================================
 */

/**
 * Find the cell at the edge (for resize handle detection).
 * Returns the document position of the cell, or -1 if not found.
 */
function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: "left" | "right",
  handleWidth: number
): number {
  const offset = side === "right" ? -handleWidth : handleWidth;

  const found = view.posAtCoords({
    left: event.clientX + offset,
    top: event.clientY,
  });

  if (!found) return -1;

  const $cell = cellAround(view.state.doc.resolve(found.pos));
  if (!$cell) return -1;

  // Right edge: resize current cell
  if (side === "right") return $cell.pos;

  // For left side, we need to find the cell to the left
  const table = $cell.node(-1);
  const map = TableMap.get(table);
  const start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);

  // If we're at column 0, there's no cell to the left
  if (index % map.width === 0) return -1;

  return start + map.map[index - 1];
}

/**
 * ============================================================================
 * Decorations
 * ============================================================================
 */

/**
 * Create decorations for the resize handle.
 * This places the handle inside each cell of the active column,
 * positioned at the right border.
 */
function handleDecorations(
  state: EditorState,
  cellPos: number,
  dragging: boolean,
  handleWidth: number
): DecorationSet {
  const decorations: Decoration[] = [];
  const $cell = state.doc.resolve(cellPos);
  const table = $cell.node(-1);
  if (!table) return DecorationSet.empty;

  const map = TableMap.get(table);
  const start = $cell.start(-1);

  // Determine column index
  const col =
    map.colCount($cell.pos - start) + ($cell.nodeAfter?.attrs.colspan || 1) - 1;

  // Add handle decoration to each cell in this column
  for (let row = 0; row < map.height; row++) {
    const index = col + row * map.width;
    const cellPos = map.map[index];

    // Skip if this cell spans from a previous column or row
    if (col < map.width - 1 && cellPos === map.map[index + 1]) continue;
    if (row > 0 && cellPos === map.map[index - map.width]) continue;

    const cellNode = table.nodeAt(cellPos);
    if (!cellNode) continue;

    // Position at the end of the cell (before closing tag)
    const widgetPos = start + cellPos + cellNode.nodeSize - 1;

    const dom = document.createElement("div");
    dom.className = "column-resize-handle" + (dragging ? " is-dragging" : "");
    dom.style.width = `${handleWidth}px`;

    decorations.push(Decoration.widget(widgetPos, dom));
  }

  return DecorationSet.create(state.doc, decorations);
}

/**
 * ============================================================================
 * Resize logic
 * ============================================================================
 */
function applyColumnWidths(
  view: EditorView,
  cellPos: number,
  drag: DragState,
  clientX: number,
  minWidthPercent: number,
  intermediate: boolean = false
): void {
  const deltaX = clientX - drag.startX;
  const deltaPercent = (deltaX / drag.tableWidth) * 100;

  // Resolve from the cell position to find the correct table
  const $cell = view.state.doc.resolve(cellPos);
  const table = $cell.node(-1);
  if (!table || table.type.spec.tableRole !== "table") return;

  const tableStart = $cell.start(-1);
  const map = TableMap.get(table);

  const newWidths = calculateResizedWidths(
    drag.startWidths,
    drag.col,
    deltaPercent,
    minWidthPercent
  );

  // Apply widths to all cells
  const tr = view.state.tr;

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const mapIndex = row * map.width + col;
      const pos = map.map[mapIndex];

      // Skip if this cell was already processed (spans from above/left)
      if (row > 0 && map.map[mapIndex - map.width] === pos) continue;
      if (col > 0 && map.map[mapIndex - 1] === pos) continue;

      const cellNode = table.nodeAt(pos);
      if (!cellNode) continue;

      const colspan = cellNode.attrs.colspan || 1;
      const widths = newWidths.slice(col, col + colspan);

      tr.setNodeMarkup(tableStart + pos, null, {
        ...cellNode.attrs,
        colwidth: widths,
      });
    }
  }

  if (tr.docChanged) {
    if (intermediate) tr.setMeta("addToHistory", false);
    view.dispatch(tr);
  }
}

function checkIsLastColumn(view: EditorView, cell: number) {
  const $cell = view.state.doc.resolve(cell);
  const table = $cell.node(-1);
  const map = TableMap.get(table);
  const tableStart = $cell.start(-1);
  const col =
    map.colCount($cell.pos - tableStart) +
    ($cell.nodeAfter?.attrs.colspan || 1) -
    1;
  return col === map.width - 1;
}

/**
 * Handle events
 */
function handleMouseMove(
  view: EditorView,
  event: MouseEvent,
  handleWidth: number
): boolean {
  if (!view.editable) return false;

  const pluginState = percentageColumnResizingPluginKey.getState(view.state);
  if (!pluginState || pluginState.dragging) return false;

  const target = domCellAround(event.target);
  let cell = -1;

  if (target) {
    const { left, right } = target.getBoundingClientRect();
    if (event.clientX - left <= handleWidth) {
      // Left border - edgeCell returns -1 for first column (nothing to resize)
      cell = edgeCell(view, event, "left", handleWidth);
    } else if (right - event.clientX <= handleWidth) {
      // Right border - check if it's the last column
      cell = edgeCell(view, event, "right", handleWidth);
      if (cell !== -1 && checkIsLastColumn(view, cell)) cell = -1;
    }
  }

  if (cell !== pluginState.activeHandle) {
    view.dispatch(
      view.state.tr.setMeta(percentageColumnResizingPluginKey, {
        setHandle: cell,
      })
    );
  }

  return false;
}

function handleMouseLeave(view: EditorView): boolean {
  if (!view.editable) return false;

  const pluginState = percentageColumnResizingPluginKey.getState(view.state);
  if (pluginState && pluginState.activeHandle > -1 && !pluginState.dragging) {
    view.dispatch(
      view.state.tr.setMeta(percentageColumnResizingPluginKey, {
        setHandle: -1,
      })
    );
  }

  return false;
}

function handleMouseDown(
  view: EditorView,
  event: MouseEvent,
  minWidthPercent: number
): boolean {
  if (!view.editable) return false;

  const pluginState = percentageColumnResizingPluginKey.getState(view.state);
  if (!pluginState || pluginState.activeHandle === -1 || pluginState.dragging)
    return false;

  const $cell = view.state.doc.resolve(pluginState.activeHandle);
  const table = $cell.node(-1);
  const tableStart = $cell.start(-1);
  const map = TableMap.get(table);
  const col =
    map.colCount($cell.pos - tableStart) +
    ($cell.nodeAfter?.attrs.colspan || 1) -
    1;
  const startWidths = getColumnWidths(table);

  // Get table DOM element to calculate pixel width
  let dom = view.domAtPos($cell.start(-1)).node as HTMLElement;
  while (dom && dom.nodeName !== "TABLE") {
    dom = dom.parentNode as HTMLElement;
  }
  if (!dom) return false;

  const tableWidth = dom.getBoundingClientRect().width;

  const dragState: DragState = {
    startX: event.clientX,
    startWidths,
    tableWidth,
    col,
  };

  view.dispatch(
    view.state.tr.setMeta(percentageColumnResizingPluginKey, {
      setDragging: dragState,
    })
  );

  const win = view.dom.ownerDocument.defaultView || window;

  const finish = (e: MouseEvent) => {
    win.removeEventListener("mouseup", finish);
    win.removeEventListener("mousemove", move);

    try {
      const pluginState = percentageColumnResizingPluginKey.getState(
        view.state
      );
      if (pluginState?.dragging) {
        applyColumnWidths(
          view,
          pluginState.activeHandle,
          pluginState.dragging,
          e.clientX,
          minWidthPercent,
          false
        );
      }

      view.dispatch(
        view.state.tr.setMeta(percentageColumnResizingPluginKey, {
          setDragging: null,
        })
      );
    } catch (error) {
      console.warn(error);
    }
  };

  const move = (e: MouseEvent) => {
    if (e.button !== 0) return finish(e);

    const pluginState = percentageColumnResizingPluginKey.getState(view.state);
    if (!pluginState?.dragging) return;

    applyColumnWidths(
      view,
      pluginState.activeHandle,
      pluginState.dragging,
      e.clientX,
      minWidthPercent,
      true
    );
  };

  win.addEventListener("mouseup", finish);
  win.addEventListener("mousemove", move);

  event.preventDefault();
  return true;
}

// ============================================================================
// Plugin
// ============================================================================

export function percentageColumnResizing({
  handleWidth = DEFAULT_HANDLE_WIDTH,
  minColumnWidthPercent = DEFAULT_MIN_COLUMN_WIDTH_PERCENT,
}: PercentageResizingOptions = {}): Plugin {
  return new Plugin<ResizingPluginState>({
    key: percentageColumnResizingPluginKey,

    state: {
      init(): ResizingPluginState {
        return { activeHandle: -1, dragging: null };
      },

      apply(tr, prev): ResizingPluginState {
        const meta = tr.getMeta(percentageColumnResizingPluginKey);
        if (meta) {
          const newState = { ...prev };

          if (meta.setHandle !== undefined) {
            newState.activeHandle = meta.setHandle;
          }
          if (meta.setDragging !== undefined) {
            newState.dragging = meta.setDragging;
          }

          return newState;
        }

        // Map handle position through document changes
        if (prev.activeHandle > -1 && tr.docChanged) {
          let handle = tr.mapping.map(prev.activeHandle, -1);
          // Verify it still points at a cell
          if (!pointsAtCell(tr.doc.resolve(handle))) handle = -1;
          if (handle !== prev.activeHandle) {
            return { ...prev, activeHandle: handle };
          }
        }

        return prev;
      },
    },

    props: {
      attributes(state): { [name: string]: string } {
        const pluginState = percentageColumnResizingPluginKey.getState(state);
        return pluginState && pluginState.activeHandle > -1
          ? { class: "resize-cursor" }
          : {};
      },

      handleDOMEvents: {
        mousemove(view, event) {
          return handleMouseMove(view, event, handleWidth);
        },
        mouseleave(view) {
          return handleMouseLeave(view);
        },
        mousedown(view, event) {
          return handleMouseDown(view, event, minColumnWidthPercent);
        },
      },

      // Decorations for the resize handle - this makes it track the cell border
      decorations(state) {
        const pluginState = percentageColumnResizingPluginKey.getState(state);
        if (pluginState && pluginState.activeHandle > -1) {
          return handleDecorations(
            state,
            pluginState.activeHandle,
            !!pluginState.dragging,
            handleWidth
          );
        }
        return DecorationSet.empty;
      },
    },
  });
}
