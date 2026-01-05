import type { BlockEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface MoveBlockOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  fromRow: number;
  fromCol: number;
  fromBlock: number;
  toRow: number;
  toCol: number;
  toBlock: number;
}

export class MoveBlockCommand extends Command {
  private movedBlock: BlockEntity | null = null; // bloque que se mueve
  private previousBlocksFrom: BlockEntity[] = [];
  private previousBlocksTo: BlockEntity[] = [];

  constructor(private options: MoveBlockOptions) {
    super();
  }

  execute() {
    const {
      getTemplate,
      setTemplate,
      fromRow,
      fromCol,
      fromBlock,
      toRow,
      toCol,
      toBlock,
    } = this.options;
    const template = getTemplate();
    if (!template) return;

    // Copiar snapshot previo de ambos bloques
    const blocksFrom = template.rows[fromRow].columns[fromCol].blocks;
    const blocksTo = template.rows[toRow].columns[toCol].blocks;

    this.previousBlocksFrom = [...blocksFrom];
    this.previousBlocksTo = [...blocksTo];

    // Bloque que se va a mover
    this.movedBlock = blocksFrom[fromBlock];

    // Copia inmutable de template
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== fromRow && rIdx !== toRow) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (
          (rIdx === fromRow && cIdx === fromCol) ||
          (rIdx === toRow && cIdx === toCol)
        ) {
          return { ...col, blocks: [...col.blocks] };
        }
        return col;
      });

      return { ...row, columns: newColumns };
    });

    // Remover bloque de origen
    newRows[fromRow].columns[fromCol].blocks.splice(fromBlock, 1);

    // Insertar bloque en destino
    newRows[toRow].columns[toCol].blocks.splice(toBlock, 0, this.movedBlock);

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, fromRow, fromCol, toRow, toCol } =
      this.options;
    const template = getTemplate();
    if (!template || !this.movedBlock) return;

    // Restaurar snapshot previo
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx !== fromRow && rIdx !== toRow) return row;

      const newColumns = row.columns.map((col, cIdx) => {
        if (rIdx === fromRow && cIdx === fromCol)
          return { ...col, blocks: [...this.previousBlocksFrom] };
        if (rIdx === toRow && cIdx === toCol)
          return { ...col, blocks: [...this.previousBlocksTo] };
        return col;
      });

      return { ...row, columns: newColumns };
    });

    setTemplate({ ...template, rows: newRows });
  }
}
