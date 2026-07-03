import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { cellAround, pointsAtCell, TableMap } from "@tiptap/pm/tables";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";

import {
  calculateResizedWidths,
  getColumnWidths,
  updateAllCellWidths,
} from "@/features/richtext/extensions/nodes/table/utils";

interface DragState {
  startX: number;
  startWidths: number[];
  tableWidthPx: number;
  col: number;
}

interface ResizingState {
  activeHandle: number;
  dragging: DragState | null;
}

export const percentResizingKey = new PluginKey<ResizingState>(
  "percentColumnResizing",
);

function domCellAround(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName != "TD" && target.nodeName != "TH")
    target =
      target.classList && target.classList.contains("ProseMirror")
        ? null
        : (target.parentNode as HTMLElement);
  return target;
}

function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: "left" | "right",
  handleWidth: number,
): number {
  const offset = side == "right" ? -handleWidth : handleWidth;
  const found = view.posAtCoords({
    left: event.clientX + offset,
    top: event.clientY,
  });
  if (!found) return -1;
  const { pos } = found;
  const $cell = cellAround(view.state.doc.resolve(pos));
  if (!$cell) return -1;
  if (side == "right") return $cell.pos;
  const map = TableMap.get($cell.node(-1)),
    start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);
  return index % map.width == 0 ? -1 : start + map.map[index - 1];
}

function isLastColumn(view: EditorView, cellPos: number): boolean {
  const $cell = view.state.doc.resolve(cellPos);
  const table = $cell.node(-1);
  const map = TableMap.get(table);
  const start = $cell.start(-1);
  const col =
    map.colCount($cell.pos - start) + ($cell.nodeAfter?.attrs.colspan || 1) - 1;
  return col === map.width - 1;
}

function handleDecorations(
  state: EditorState,
  cellPos: number,
  isDragging: boolean,
  handleWidth: number,
): DecorationSet {
  const decorations: Decoration[] = [];
  const $cell = state.doc.resolve(cellPos);
  const table = $cell.node(-1);
  if (!table) return DecorationSet.empty;

  const map = TableMap.get(table);
  const start = $cell.start(-1);
  const col =
    map.colCount($cell.pos - start) + ($cell.nodeAfter?.attrs.colspan || 1) - 1;

  for (let row = 0; row < map.height; row++) {
    const idx = col + row * map.width;
    const pos = map.map[idx];
    if (row > 0 && pos === map.map[idx - map.width]) continue;
    if (col < map.width - 1 && pos === map.map[idx + 1]) continue;

    const cellNode = table.nodeAt(pos);
    if (!cellNode) continue;

    const widgetPos = start + pos + cellNode.nodeSize - 1;
    const el = document.createElement("div");
    el.className = "column-resize-handle" + (isDragging ? " is-dragging" : "");
    el.style.width = `${handleWidth}px`;
    decorations.push(Decoration.widget(widgetPos, el));
  }

  return DecorationSet.create(state.doc, decorations);
}

function applyWidths(
  view: EditorView,
  cellPos: number,
  drag: DragState,
  clientX: number,
  minWidth: number,
  addToHistory: boolean,
): void {
  const deltaPercent = ((clientX - drag.startX) / drag.tableWidthPx) * 100;
  const $cell = view.state.doc.resolve(cellPos);
  const table = $cell.node(-1);
  if (!table || table.type.spec.tableRole !== "table") return;

  const tablePos = $cell.start(-1) - 1; // position of the table node
  const newWidths = calculateResizedWidths(
    drag.startWidths,
    drag.col,
    deltaPercent,
    minWidth,
  );
  // calculateResizedWidths returns the same reference when delta < 0.01 — skip dispatch
  if (newWidths === drag.startWidths) return;

  const tr = view.state.tr;
  updateAllCellWidths(tr, tablePos, table, newWidths);
  if (!addToHistory) tr.setMeta("addToHistory", false);
  if (tr.docChanged) view.dispatch(tr);
}

function handleMouseMove(
  view: EditorView,
  event: MouseEvent,
  handleWidth: number,
): boolean {
  if (!view.editable) return false;
  const ps = percentResizingKey.getState(view.state);
  if (!ps || ps.dragging) return false;

  const cell = domCellAround(event.target as HTMLElement);
  let handle = -1;

  if (cell) {
    const { left, right } = cell.getBoundingClientRect();
    if (event.clientX - left <= handleWidth) {
      handle = edgeCell(view, event, "left", handleWidth);
    } else if (right - event.clientX <= handleWidth) {
      handle = edgeCell(view, event, "right", handleWidth);
      if (handle !== -1 && isLastColumn(view, handle)) handle = -1;
    }
  }

  if (handle !== ps.activeHandle) {
    view.dispatch(
      view.state.tr.setMeta(percentResizingKey, { setHandle: handle }),
    );
  }
  return false;
}

function handleMouseLeave(view: EditorView): boolean {
  const ps = percentResizingKey.getState(view.state);
  if (ps && ps.activeHandle > -1 && !ps.dragging) {
    view.dispatch(view.state.tr.setMeta(percentResizingKey, { setHandle: -1 }));
  }
  return false;
}

function handleMouseDown(
  view: EditorView,
  event: MouseEvent,
  minWidth: number,
): boolean {
  if (!view.editable) return false;
  const ps = percentResizingKey.getState(view.state);
  if (!ps || ps.activeHandle === -1 || ps.dragging) return false;

  const $cell = view.state.doc.resolve(ps.activeHandle);
  const table = $cell.node(-1);
  const start = $cell.start(-1);
  const map = TableMap.get(table);
  const col =
    map.colCount($cell.pos - start) + ($cell.nodeAfter?.attrs.colspan || 1) - 1;

  // Get table DOM element for pixel width
  let domEl = view.domAtPos(start).node as HTMLElement;
  while (domEl && domEl.nodeName !== "TABLE") domEl = domEl.parentElement!;
  if (!domEl) return false;

  const drag: DragState = {
    startX: event.clientX,
    startWidths: getColumnWidths(table),
    tableWidthPx: domEl.getBoundingClientRect().width,
    col,
  };

  view.dispatch(
    view.state.tr.setMeta(percentResizingKey, { setDragging: drag }),
  );

  const win = view.dom.ownerDocument.defaultView ?? window;

  const finish = (e: MouseEvent) => {
    win.removeEventListener("mouseup", finish);
    win.removeEventListener("mousemove", move);
    const cur = percentResizingKey.getState(view.state);
    if (cur?.dragging) {
      applyWidths(
        view,
        cur.activeHandle,
        cur.dragging,
        e.clientX,
        minWidth,
        true,
      );
    }
    view.dispatch(
      view.state.tr.setMeta(percentResizingKey, { setDragging: null }),
    );
  };

  const move = (e: MouseEvent) => {
    if (e.button !== 0) return finish(e);
    const cur = percentResizingKey.getState(view.state);
    if (!cur?.dragging) return;
    applyWidths(
      view,
      cur.activeHandle,
      cur.dragging,
      e.clientX,
      minWidth,
      false,
    );
  };

  win.addEventListener("mouseup", finish);
  win.addEventListener("mousemove", move);
  event.preventDefault();
  return true;
}

export interface ColumnResizingOptions {
  handleWidth: number;
  cellMinWidth: number;
}

export function columnResizing({
  handleWidth,
  cellMinWidth,
}: ColumnResizingOptions): Plugin<ResizingState> {
  return new Plugin<ResizingState>({
    key: percentResizingKey,

    state: {
      init: (): ResizingState => ({ activeHandle: -1, dragging: null }),
      apply(tr, prev): ResizingState {
        const meta = tr.getMeta(percentResizingKey);
        if (meta) {
          const next = { ...prev };
          if (meta.setHandle !== undefined) next.activeHandle = meta.setHandle;
          if (meta.setDragging !== undefined) next.dragging = meta.setDragging;
          return next;
        }
        if (prev.activeHandle > -1 && tr.docChanged) {
          let h = tr.mapping.map(prev.activeHandle, -1);
          if (!pointsAtCell(tr.doc.resolve(h))) h = -1;
          if (h !== prev.activeHandle) return { ...prev, activeHandle: h };
        }
        return prev;
      },
    },

    props: {
      attributes(state): Record<string, string> {
        const ps = percentResizingKey.getState(state);
        return ps && ps.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },

      handleDOMEvents: {
        mousemove: (view, e) => handleMouseMove(view, e, handleWidth),
        mouseleave: (view) => handleMouseLeave(view),
        mousedown: (view, e) => handleMouseDown(view, e, cellMinWidth),
      },

      decorations(state) {
        const ps = percentResizingKey.getState(state);
        if (ps && ps.activeHandle > -1) {
          return handleDecorations(
            state,
            ps.activeHandle,
            !!ps.dragging,
            handleWidth,
          );
        }
        return DecorationSet.empty;
      },
    },
  });
}
