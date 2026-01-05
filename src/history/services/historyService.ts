// historyService.ts
import { CommandHistory } from "@/history/CommandHistory";
import { CommandEntry } from "@/history/CommandEntry";
import type { Command } from "@/commands/Command";
import type { CommandMetadata } from "@/history/types";

type Listener = () => void;

/**
 * HistoryService Singleton
 * Maneja un timeline de comandos con undo/redo y metadata
 */
class HistoryService {
  private history = new CommandHistory();
  private listeners = new Set<Listener>();

  /**
   * Ejecuta un comando y lo agrega al timeline
   * @param command Command puro
   * @param meta Metadata opcional; si no se pasa, se genera id y timestamp
   */
  executeCommand(command: Command, meta: CommandMetadata) {
    const entry = new CommandEntry(command, meta);

    this.history.execute(entry);
    this.notify();
  }

  undo() {
    this.history.undo();
    this.notify();
  }

  redo() {
    this.history.redo();
    this.notify();
  }

  goTo(index: number) {
    this.history.goTo(index);
    this.notify();
  }

  clear() {
    this.history.clear();
    this.notify();
  }

  canUndo(): boolean {
    return this.history.getCurrentIndex() >= 0;
  }

  canRedo(): boolean {
    return (
      this.history.getCurrentIndex() < this.history.getTimeline().length - 1
    );
  }

  getCurrentIndex(): number {
    return this.history.getCurrentIndex();
  }

  getTimeline(): readonly CommandEntry[] {
    return this.history.getTimeline();
  }

  // Suscripción para React/Zustand
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
}

// Export singleton
export const historyService = new HistoryService();
