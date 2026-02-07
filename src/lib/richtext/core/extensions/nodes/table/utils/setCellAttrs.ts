import type { CellAttrs } from "../types";

export function setCellAttrs(node: {
  attrs: CellAttrs;
}): Record<string, string> {
  const attrs: Record<string, string> = {};
  const styles: string[] = [];

  if (node.attrs.colspan !== 1) {
    attrs.colspan = String(node.attrs.colspan);
  }

  if (node.attrs.rowspan !== 1) {
    attrs.rowspan = String(node.attrs.rowspan);
  }

  if (node.attrs.colwidth && node.attrs.colwidth.length > 0) {
    attrs["data-colwidth"] = node.attrs.colwidth
      .map((w) => w.toFixed(2))
      .join(",");
    const totalWidth = node.attrs.colwidth.reduce((sum, w) => sum + w, 0);
    styles.push(`width: ${totalWidth.toFixed(2)}%`);
    attrs.width = `${totalWidth.toFixed(2)}%`;
  }

  if (node.attrs.backgroundColor) {
    styles.push(`background-color: ${node.attrs.backgroundColor}`);
    attrs.bgcolor = node.attrs.backgroundColor;
  }

  const border = node.attrs.border || {
    width: "1px",
    style: "solid",
    color: "#000000",
  };

  const borderValue = `${border.width} ${border.style} ${border.color}`;
  styles.push(`border: ${borderValue}`);
  attrs.border = borderValue;

  styles.push("position: relative");
  styles.push("vertical-align: top");
  styles.push("padding: 5px");

  if (styles.length > 0) {
    attrs.style = styles.join("; ");
  }

  return attrs;
}
