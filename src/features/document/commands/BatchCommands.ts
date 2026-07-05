import { Command } from "@/features/document/commands/Command";

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

  execute(): void {
    for (const command of this.commands) {
      command.execute();
    }
  }

  undo(): void {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}