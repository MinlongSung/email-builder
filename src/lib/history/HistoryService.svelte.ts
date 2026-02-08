import { EventEmitter } from "./EventEmitter";
import { HistoryEntry } from "./HistoryEntry";
import type { Events, CommandMetadata } from "./types";
import type { Command } from "../commands/Command";
import { generateId } from "$lib/template/utils/generateId";

export class HistoryService extends EventEmitter<Events> {
  private _timeline: HistoryEntry[] = $state([]);
  private _currentIndex = $state(-1);
  private readonly MAX_CHANGES = 200;

  get timeline() {
    return this._timeline;
  }

  get currentIndex() {
    return this._currentIndex;
  }

  executeCommand(command: Command, meta: Omit<CommandMetadata, "id" | "timestamp">) {
    const entry = new HistoryEntry(command, {
      ...meta,
      id: generateId(),
      timestamp: Date.now(),
    });

    this.execute(entry);
  }

  private execute(entry: HistoryEntry) {
    this._timeline = this._timeline.slice(0, this._currentIndex + 1);

    entry.command.execute();
    this._timeline.push(entry);
    this._currentIndex++;

    if (this._timeline.length > this.MAX_CHANGES) {
      const excess = this._timeline.length - this.MAX_CHANGES;
      this._timeline.splice(0, excess);
      this._currentIndex -= excess;
    }

    this.emit("execute", { entry });
  }

  undo() {
    if (this._currentIndex < 0) return;
    const entry = this._timeline[this._currentIndex];
    entry.command.undo();
    this._currentIndex--;

    this.emit("undo", { entry, index: this._currentIndex });
  }

  redo() {
    if (this._currentIndex + 1 >= this._timeline.length) return;
    const entry = this._timeline[this._currentIndex + 1];
    entry.command.execute();
    this._currentIndex++;

    this.emit("redo", { entry, index: this._currentIndex });
  }

  goTo(index: number) {
    if (index < -1 || index >= this._timeline.length) return;

    const from = this._currentIndex;

    while (this._currentIndex < index) {
      this._currentIndex++;
      this._timeline[this._currentIndex].command.execute();
    }
    while (this._currentIndex > index) {
      this._timeline[this._currentIndex].command.undo();
      this._currentIndex--;
    }

    this.emit("goto", { from, to: index });
  }

  clear() {
    this._timeline = [];
    this._currentIndex = -1;
  }

  getCurrentIndex() {
    return this._currentIndex;
  }

  getTimeline(): readonly HistoryEntry[] {
    return this._timeline;
  }

  canUndo(): boolean {
    return this._currentIndex >= 0;
  }

  canRedo(): boolean {
    return this._currentIndex < this._timeline.length - 1;
  }
}

export const historyService = new HistoryService();

