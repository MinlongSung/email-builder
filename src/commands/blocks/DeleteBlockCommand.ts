import type { BlockEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface DeleteBlockOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
}

export class DeleteBlockCommand extends Command {
  private deletedBlock: BlockEntity | null = null;
  private previousBlocks: BlockEntity[] = [];

  constructor(private options: DeleteBlockOptions) {
    super();
  }

  execute() {
    const { getTemplate, setTemplate, rowIndex, columnIndex, blockIndex } =
      this.options;
    const template = getTemplate();
    if (!template) return;

    const column = template.rows[rowIndex].columns[columnIndex];
    this.previousBlocks = [...column.blocks]; // snapshot previo
    this.deletedBlock = column.blocks[blockIndex]; // guardar bloque eliminado

    // Copia inmutable del template
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (cIdx !== columnIndex) return col;
        return { ...col, blocks: [...col.blocks] }; // copiar blocks
      });

      return { ...row, columns: newColumns };
    });

    // Eliminar bloque
    newRows[rowIndex].columns[columnIndex].blocks.splice(blockIndex, 1);

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, rowIndex, columnIndex } = this.options;
    const template = getTemplate();
    if (!template || !this.deletedBlock) return;

    // Copia inmutable del template
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (cIdx !== columnIndex) return col;
        return { ...col, blocks: [...this.previousBlocks] }; // restaurar snapshot
      });

      return { ...row, columns: newColumns };
    });

    setTemplate({ ...template, rows: newRows });
  }
}
