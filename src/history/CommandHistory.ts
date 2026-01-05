import type { CommandEntry } from "./CommandEntry";

export class CommandHistory {
  private timeline: CommandEntry[] = [];
  private currentIndex: number = -1;

  execute(entry: CommandEntry) {
    this.timeline = this.timeline.slice(0, this.currentIndex + 1);
    entry.command.execute();
    this.timeline.push(entry);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex < 0) return;
    const entry = this.timeline[this.currentIndex];
    entry.command.undo();
    this.currentIndex--;
  }

  redo() {
    if (this.currentIndex + 1 >= this.timeline.length) return;
    const entry = this.timeline[this.currentIndex + 1];
    entry.command.execute();
    this.currentIndex++;
  }

  goTo(index: number) {
    if (index < -1 || index >= this.timeline.length) return;
    while (this.currentIndex < index) {
      this.currentIndex++;
      this.timeline[this.currentIndex].command.execute();
    }
    while (this.currentIndex > index) {
      this.timeline[this.currentIndex].command.undo();
      this.currentIndex--;
    }
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getTimeline(): readonly CommandEntry[] {
    return this.timeline;
  }

  clear() {
    this.timeline = [];
    this.currentIndex = -1;
  }
}
