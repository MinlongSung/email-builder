import { getContext, setContext } from 'svelte';
import { HistoryService } from '../HistoryService.svelte';

const CONTEXT_KEY = Symbol('history');

export function setHistoryContext() {
  const historyService = new HistoryService();
  setContext(CONTEXT_KEY, historyService);
}

export function getHistoryContext() {
  return getContext<HistoryService>(CONTEXT_KEY);
}
