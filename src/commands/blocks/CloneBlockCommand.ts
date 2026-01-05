import type { BlockEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface CloneBlockOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  generateId: () => string;
}

export class CloneBlockCommand extends Command {
  private clonedBlock: BlockEntity | null = null;

  constructor(private options: CloneBlockOptions) {
    super();
  }

  execute() {
    const { getTemplate, setTemplate, rowIndex, columnIndex, blockIndex } =
      this.options;
    const template = getTemplate();
    if (!template) return;

    const column = template.rows[rowIndex].columns[columnIndex];
    const originalBlock = column.blocks[blockIndex];

    // Crear clon con nuevo id
    this.clonedBlock = { ...originalBlock, id: this.options.generateId() };

    // Copiar template inmutable
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (cIdx !== columnIndex) return col;

        return { ...col, blocks: [...col.blocks] };
      });

      return { ...row, columns: newColumns };
    });

    // Insertar el bloque clonado
    newRows[rowIndex].columns[columnIndex].blocks.splice(
      blockIndex + 1,
      0,
      this.clonedBlock
    );

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, rowIndex, columnIndex } = this.options;
    const template = getTemplate();
    if (!template || !this.clonedBlock) return;

    const column = template.rows[rowIndex].columns[columnIndex];
    const index = column.blocks.findIndex((b) => b.id === this.clonedBlock?.id);
    if (index < 0) return;

    // Copiar template inmutable
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (cIdx !== columnIndex) return col;

        return { ...col, blocks: [...col.blocks] };
      });

      return { ...row, columns: newColumns };
    });

    // Remover bloque clonado
    newRows[rowIndex].columns[columnIndex].blocks.splice(index, 1);

    setTemplate({ ...template, rows: newRows });
  }
}
