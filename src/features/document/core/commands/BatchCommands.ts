import { Command } from "@/features/document/commands/Command";
import type { BlockTree } from "@/features/models/types";

export class BatchCommand extends Command {
  private readonly commands: Command[] = [];

  constructor(commands: readonly Command[] = []) {
    super();

    this.commands.push(...commands);
  }

  get isEmpty(): boolean {
    return this.commands.length === 0;
  }

  add(command: Command): this {
    this.commands.push(command);

    return this;
  }

  execute(document: BlockTree): BlockTree {
    let current = document;

    for (const command of this.commands) {
      current = command.execute(current);
    }

    return current;
  }

  undo(document: BlockTree): BlockTree {
    let current = document;

    for (let i = this.commands.length - 1; i >= 0; i--) {
      current = this.commands[i].undo(current);
    }

    return current;
  }
}
