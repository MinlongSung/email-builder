import { createContext } from 'react';
import type { DndManager } from '@/features/dnd/core/DndManager';
import type { DndState } from '@/features/dnd/core/types';

export interface DndContextValue {
  manager: DndManager;
  state: DndState;
}

export const DndContext = createContext<DndContextValue | null>(null);
