import { Extension } from "@tiptap/core";
import { TableRow } from "@tiptap/extension-table";

import { Table } from "@/features/richtext/extensions/nodes/table/Table";
import { TableCell } from "@/features/richtext/extensions/nodes/table/TableCell";
import { TableHeader } from "@/features/richtext/extensions/nodes/table/TableHeader";

export const TableKit = Extension.create({
  name: "tableKit",

  addExtensions() {
    return [Table, TableRow, TableCell, TableHeader];
  },
});
