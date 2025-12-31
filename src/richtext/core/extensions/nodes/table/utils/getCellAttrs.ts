import type { CellAttrs } from "@/richtext/core/extensions/nodes/table/types";
import { parseColorFromStyle } from "@/richtext/core/extensions/utils/parseColorFromStyle";

export function getCellAttrs(dom: HTMLElement): CellAttrs {
  const colspan = Number(dom.getAttribute("colspan") || 1);
  const rowspan = Number(dom.getAttribute("rowspan") || 1);

  let colwidth: number[] | null = null;
  const colwidthAttr = dom.getAttribute("data-colwidth");

  if (colwidthAttr) {
    colwidth = colwidthAttr
      .split(",")
      .map((w) => parseFloat(w))
      .filter((w) => !isNaN(w) && w > 0);
    if (colwidth.length === 0) colwidth = null;
  } else {
    const styleWidth = dom.style.width || dom.getAttribute("width");
    if (styleWidth) {
      let width: number | null = null;
      if (styleWidth.endsWith("%")) {
        width = parseFloat(styleWidth);
      } else if (styleWidth.endsWith("px")) {
        const px = parseFloat(styleWidth);
        width = (px / 600) * 100;
      }
      if (width && !isNaN(width)) {
        colwidth = Array(colspan).fill(width / colspan);
      }
    }
  }

  const backgroundColor = parseColorFromStyle(dom, "background-color");
  const borderWidth = parseInt(dom.style.borderWidth) || 1;
  const borderStyle = dom.style.borderStyle || "solid";
  const borderColor = parseColorFromStyle(dom, "border-color") || "#000000";

  return {
    colspan,
    rowspan,
    colwidth,
    backgroundColor,
    borderWidth,
    borderStyle,
    borderColor,
  };
}
