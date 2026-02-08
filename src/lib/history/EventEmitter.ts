type Listener<T> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, any>> {
  private listeners = new Map<keyof Events, Set<Listener<any>>>();

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>): this {
    const set = this.listeners.get(event) ?? new Set();
    set.add(fn);
    this.listeners.set(event, set);
    return this;
  }

  off<K extends keyof Events>(event: K, fn: Listener<Events[K]>): this {
    this.listeners.get(event)?.delete(fn);
    return this;
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): this {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
    return this;
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }

  destroy(): void {
    this.removeAllListeners();
  }
}
