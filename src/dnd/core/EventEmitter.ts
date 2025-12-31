import type { DndEvents, EventCallback } from "@/dnd/core/types";

export class EventEmitter {
  private listeners: Map<keyof DndEvents, EventCallback[]> = new Map();

  on<K extends keyof DndEvents>(
    event: K,
    callback: EventCallback<DndEvents[K]>
  ) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback as EventCallback);
  }

  once<K extends keyof DndEvents>(
    event: K,
    callback: EventCallback<DndEvents[K]>
  ) {
    const wrappedCallback = (payload: DndEvents[K]) => {
      callback(payload);
      this.off(event, wrappedCallback as EventCallback<DndEvents[K]>);
    };
    this.on(event, wrappedCallback as EventCallback<DndEvents[K]>);
  }

  off<K extends keyof DndEvents>(
    event: K,
    callback: EventCallback<DndEvents[K]>
  ) {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    this.listeners.set(
      event,
      cbs.filter((cb) => cb !== callback)
    );
  }

  removeAllListeners<K extends keyof DndEvents>(event?: K) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount<K extends keyof DndEvents>(event: K): number {
    return this.listeners.get(event)?.length ?? 0;
  }

  emit<K extends keyof DndEvents>(event: K, payload: DndEvents[K]) {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    cbs.forEach((cb) => cb(payload));
  }
}
