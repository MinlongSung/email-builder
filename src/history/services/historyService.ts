import type { Command } from "@/history/types";

export class HistoryService {
  private timeline: Command[] = [];
  private index = -1;
  private listeners = new Set<() => void>();

  // Subscribe UI / store
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  executeCommand(cmd: Command) {
    // cortar cualquier “futuro” si se hizo undo
    this.timeline = this.timeline.slice(0, this.index + 1);

    cmd.execute();
    this.timeline.push(cmd);
    this.index++;

    this.notify();
  }

  undo() {
    if (this.index < 0) return;
    this.timeline[this.index].undo();
    this.index--;
    this.notify();
  }

  redo() {
    if (this.index >= this.timeline.length - 1) return;
    this.index++;
    this.timeline[this.index].execute();
    this.notify();
  }

  goTo(targetIndex: number) {
    while (this.index > targetIndex) {
      this.timeline[this.index].undo();
      this.index--;
    }
    while (this.index < targetIndex) {
      this.index++;
      this.timeline[this.index].execute();
    }
    this.notify();
  }

  canUndo() {
    return this.index >= 0;
  }

  canRedo() {
    return this.index < this.timeline.length - 1;
  }

  getTimeline() {
    return this.timeline;
  }

  getIndex() {
    return this.index;
  }

  clear() {
    this.timeline = [];
    this.index = -1;
    this.notify();
  }
}

export const historyService = new HistoryService();