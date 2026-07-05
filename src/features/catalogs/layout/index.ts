import type { BlockTemplate } from "@/features/models/types";

import { createRowTemplate } from "@/features/catalogs/layout/row";

export const ROW_TEMPLATES: BlockTemplate[] = [
  createRowTemplate("1 Column", [100]),

  createRowTemplate("2 Columns", [50, 50]),

  createRowTemplate("3 Columns", [33, 34, 33]),

  createRowTemplate("4 Columns", [25, 25, 25, 25]),

  createRowTemplate("2 / 3 + 1 / 3", [66, 34]),

  createRowTemplate("1 / 3 + 2 / 3", [34, 66]),

  createRowTemplate("3 / 4 + 1 / 4", [75, 25]),

  createRowTemplate("1 / 4 + 3 / 4", [25, 75]),

  createRowTemplate("20 / 60 / 20", [20, 60, 20]),

  createRowTemplate("40 / 20 / 40", [40, 20, 40]),

  createRowTemplate("40 / 60", [40, 60]),

  createRowTemplate("20 / 20 / 60", [20, 20, 60]),

  createRowTemplate("5 Columns", [20, 20, 20, 20, 20]),

  createRowTemplate("6 Columns", [16, 17, 17, 17, 17, 16]),
];
