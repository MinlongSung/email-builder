import type { Command } from "../commands/Command";
import type { CommandMetadata } from "./types";

export class HistoryEntry {
  readonly id: string;
  readonly timestamp: number;

  constructor(public command: Command, public meta: CommandMetadata) {
    this.id = meta.id;
    this.timestamp = meta.timestamp;
  }
}
