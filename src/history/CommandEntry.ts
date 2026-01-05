import type { Command } from "@/commands/Command";
import type { CommandMetadata } from "@/history/types";

export class CommandEntry {
  readonly id: string;
  readonly timestamp: number;

  constructor(public command: Command, public meta: CommandMetadata) {
    this.id = meta.id;
    this.timestamp = meta.timestamp;
  }
}
