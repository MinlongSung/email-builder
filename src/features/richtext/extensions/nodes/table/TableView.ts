import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { NodeView } from "@tiptap/pm/view";

import { getColumnWidths } from "@/features/richtext/extensions/nodes/table/utils";

export class TableView implements NodeView {
  dom: HTMLDivElement;
  table: HTMLTableElement;
  colgroup: HTMLTableColElement;
  contentDOM: HTMLTableSectionElement;

  private node: ProseMirrorNode;

  constructor(node: ProseMirrorNode) {
    this.node = node;

    this.dom = document.createElement("div");
    this.dom.className = "tableWrapper";
    this.dom.style.position = "relative";

    this.table = document.createElement("table");
    this.table.style.width = "100%";
    this.table.style.tableLayout = "fixed";
    this.table.style.borderCollapse = "collapse";

    this.colgroup = this.table.appendChild(
      document.createElement("colgroup") as unknown as HTMLTableColElement,
    );
    this.contentDOM = this.table.appendChild(document.createElement("tbody"));
    this.dom.appendChild(this.table);

    this.updateColgroup();
  }

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.updateColgroup();
    return true;
  }

  private updateColgroup(): void {
    const widths = getColumnWidths(this.node);

    let col = this.colgroup.firstChild as HTMLTableColElement | null;
    for (let i = 0; i < widths.length; i++) {
      const w = `${widths[i]}%`;
      if (!col) {
        col = document.createElement("col");
        this.colgroup.appendChild(col);
      }
      // Only write if changed — avoids unnecessary style recalculations
      if (col.style.width !== w) {
        col.style.width = w;
      }
      col = col.nextSibling as HTMLTableColElement | null;
    }

    // Remove surplus cols
    while (col) {
      const next = col.nextSibling as HTMLTableColElement | null;
      this.colgroup.removeChild(col);
      col = next;
    }
  }
}
