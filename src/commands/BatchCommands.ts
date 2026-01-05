import type { Command } from "./Command";

export class BatchCommand implements Command {
  private commands: Command[] = [];
  
  constructor(commands?: Command[]) {
    if (commands) this.commands = commands;
  }

  add(command: Command) {
    this.commands.push(command);
  }

  isEmpty() {
    return this.commands.length === 0;
  }

  execute() {
    for (const cmd of this.commands) {
      cmd.execute();
    }
  }

  undo() {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}
