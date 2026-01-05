import type { BlockEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface UpdateBlockOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  updates: Partial<BlockEntity>;
}

export class UpdateBlockCommand extends Command {
  private previousBlock: BlockEntity | null = null;

  constructor(private options: UpdateBlockOptions) {
    super();
  }

  execute() {
    const {
      getTemplate,
      setTemplate,
      rowIndex,
      columnIndex,
      blockIndex,
      updates,
    } = this.options;
    const template = getTemplate();
    if (!template) return;

    const column = template.rows[rowIndex].columns[columnIndex];
    const block = column.blocks[blockIndex];

    // Guardar snapshot previo para undo
    this.previousBlock = { ...block };

    // Copia inmutable del template
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (cIdx !== columnIndex) return col;
        return { ...col, blocks: [...col.blocks] }; // copiar blocks
      });

      return { ...row, columns: newColumns };
    });

    // Aplicar actualizaciones al bloque
    const newBlock = { ...block, ...updates };
    newRows[rowIndex].columns[columnIndex].blocks[blockIndex] = newBlock;

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, rowIndex, columnIndex, blockIndex } =
      this.options;
    const template = getTemplate();
    if (!template || !this.previousBlock) return;

    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (cIdx !== columnIndex) return col;
        return { ...col, blocks: [...col.blocks] };
      });

      return { ...row, columns: newColumns };
    });

    // Restaurar bloque previo
    newRows[rowIndex].columns[columnIndex].blocks[blockIndex] =
      this.previousBlock;

    setTemplate({ ...template, rows: newRows });
  }
}
