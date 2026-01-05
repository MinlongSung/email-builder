import type { BlockEntity, TemplateEntity } from "@/entities/template";
import { Command } from "@/commands/Command";

interface AddBlockCommandOptions {
  getTemplate: () => TemplateEntity | null;
  setTemplate: (t: TemplateEntity) => void;
  sourceBlock: BlockEntity; // el bloque que queremos duplicar
  rowIndex: number;
  columnIndex: number;
  blockIndex: number;
  generateId: () => string; // generador de ID
  // Callback para modificar el bloque ANTES de insertarlo
  onBeforeAdd?: (block: BlockEntity) => BlockEntity;
}

export class AddBlockCommand extends Command {
  private previousBlocks: BlockEntity[] = [];
  private newBlock: BlockEntity | null = null;

  constructor(private options: AddBlockCommandOptions) {
    super();
  }

  execute() {
    const {
      getTemplate,
      setTemplate,
      sourceBlock,
      rowIndex,
      columnIndex,
      blockIndex,
      generateId,
    } = this.options;
    const template = getTemplate();
    if (!template) return;

    // Guardar snapshot previo para undo
    this.previousBlocks = [
      ...template.rows[rowIndex].columns[columnIndex].blocks,
    ];

    // Crear bloque nuevo dentro del Command
    this.newBlock = { ...sourceBlock, id: generateId() };

    // Aplicar modificaciones al bloque ANTES de insertarlo (si hay callback)
    if (this.options.onBeforeAdd) {
      this.newBlock = this.options.onBeforeAdd(this.newBlock);
    }

    // Copia inmutable del template
    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const newColumns = row.columns.map((col, cIdx) => {
          if (cIdx === columnIndex) {
            return {
              ...col,
              blocks: [...col.blocks],
            };
          }
          return col;
        });
        return { ...row, columns: newColumns };
      }
      return row;
    });

    // Insertar bloque ya modificado
    newRows[rowIndex].columns[columnIndex].blocks.splice(
      blockIndex,
      0,
      this.newBlock
    );

    setTemplate({ ...template, rows: newRows });
  }

  undo() {
    const { getTemplate, setTemplate, rowIndex, columnIndex } = this.options;
    const template = getTemplate();
    if (!template || !this.newBlock) return;

    const newRows = template.rows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const newColumns = row.columns.map((col, cIdx) => {
          if (cIdx === columnIndex) {
            return {
              ...col,
              blocks: [...this.previousBlocks],
            };
          }
          return col;
        });
        return { ...row, columns: newColumns };
      }
      return row;
    });

    setTemplate({ ...template, rows: newRows });
  }
}
