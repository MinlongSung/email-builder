import type { CommandMetadata, CommandType } from "@/history/types";
import { generateId } from "@/utils/generateId";

interface BaseCommandOptions {
  type: CommandType;
  userId?: string;
}

export abstract class BaseCommand {
  metadata: CommandMetadata;

  constructor({ type, userId }: BaseCommandOptions) {
    this.metadata = {
      id: generateId(),
      timestamp: Date.now(),
      userId,
      type,
      changes: [],
    };
  }

  abstract execute(): void;
  abstract undo(): void;
}
