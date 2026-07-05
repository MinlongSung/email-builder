import { createRowTree } from "@/features/catalogs/layout/row/utils/createRowTree";
import type { BlockTemplate } from "@/features/models/types";

export function createRowTemplate(
  name: string,
  widths: number[],
): BlockTemplate {
  const cols = widths.join("-");
  const id = `row-${cols}`;

  return {
    id,

    type: "row",

    name,

    create: () => createRowTree(widths),
  };
}
