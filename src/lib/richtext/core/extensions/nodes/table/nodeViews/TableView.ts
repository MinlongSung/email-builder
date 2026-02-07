import type { Node } from "prosemirror-model";
import { TableMap } from "prosemirror-tables";
import type { NodeView } from "prosemirror-view";
import { getColumnWidths } from "../utils/getColumnWidths";

export class TableView implements NodeView {
  dom: HTMLElement;
  table: HTMLTableElement;
  colgroup: HTMLElement;
  tbody: HTMLElement;
  contentDOM: HTMLElement;

  private node: Node;

  constructor(node: Node) {
    this.node = node;

    // Create wrapper div for overflow handling
    this.dom = document.createElement("div");
    this.dom.style.position = "relative";

    // Create table with email-compatible inline styles
    this.table = document.createElement("table");
    this.table.style.width = node.attrs.tableWidth || "100%";
    this.table.style.tableLayout = "fixed";
    this.table.style.borderCollapse = "collapse";
    this.table.style.borderSpacing = "0";
    // Email-compatible: also set as attribute
    this.table.setAttribute("width", "100%");
    this.table.setAttribute("cellpadding", "0");
    this.table.setAttribute("cellspacing", "0");

    // Create colgroup for column widths
    this.colgroup = document.createElement("colgroup");
    this.table.appendChild(this.colgroup);

    // Create tbody for content
    this.tbody = document.createElement("tbody");
    this.table.appendChild(this.tbody);

    this.dom.appendChild(this.table);

    // Set contentDOM to tbody so ProseMirror renders rows inside it
    this.contentDOM = this.tbody;

    // Initialize column widths
    this.updateColumnWidths();
  }

  /**
   * Update the colgroup elements based on current column widths
   */
  updateColumnWidths(): void {
    const { width: columnCount } = TableMap.get(this.node);
    const widths = getColumnWidths(this.node);

    // Clear existing cols
    while (this.colgroup.firstChild) {
      this.colgroup.removeChild(this.colgroup.firstChild);
    }

    // Create col elements for each column
    for (let i = 0; i < columnCount; i++) {
      const col = document.createElement("col");
      const width = widths[i] || 100 / columnCount;
      // Set both style and attribute for email compatibility
      col.style.width = `${width}%`;
      col.setAttribute("width", `${width}%`);
      col.setAttribute("data-col-index", String(i));
      this.colgroup.appendChild(col);
    }
  }

  /**
   * Update the view when the node changes
   */
  update(node: Node): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;

    // Update table width if changed
    const tableWidth = node.attrs.tableWidth || "100%";
    if (this.table.style.width !== tableWidth) {
      this.table.style.width = tableWidth;
      this.table.setAttribute("width", tableWidth.replace("%", "") + "%");
    }

    // Update column widths
    this.updateColumnWidths();

    return true;
  }
}
