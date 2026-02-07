// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { DndStore } from '../DndStore';
import type { Draggable, Droppable, Scrollable } from '../types';

function mockElement(): HTMLElement {
    return document.createElement('div');
}

function makeDraggable(id: string, data: any = {}): Draggable {
    return { id, data, element: mockElement() };
}

function makeDroppable(id: string, data: any = {}): Droppable {
    return { id, data, element: mockElement() };
}

function makeScrollable(id: string): Scrollable {
    return { id, element: mockElement() };
}

describe('DndStore', () => {
    describe('initial state', () => {
        it('starts with default state', () => {
            const store = new DndStore();
            const state = store.getState();
            expect(state.isDragging).toBe(false);
            expect(state.draggable).toBeNull();
            expect(state.droppable).toBeNull();
            expect(state.coordinates).toEqual({ x: 0, y: 0 });
            expect(state.isTopHalf).toBe(false);
        });

        it('starts with no registered elements', () => {
            const store = new DndStore();
            expect(store.getDraggables()).toHaveLength(0);
            expect(store.getDroppables()).toHaveLength(0);
            expect(store.getScrollables()).toHaveLength(0);
        });
    });

    describe('draggables', () => {
        it('registers a draggable', () => {
            const store = new DndStore();
            const draggable = makeDraggable('d1');
            store.registerDraggable(draggable);

            expect(store.getDraggable('d1')).toBe(draggable);
            expect(store.getDraggables()).toHaveLength(1);
        });

        it('unregisters a draggable', () => {
            const store = new DndStore();
            store.registerDraggable(makeDraggable('d1'));
            store.unregisterDraggable('d1');

            expect(store.getDraggable('d1')).toBeUndefined();
            expect(store.getDraggables()).toHaveLength(0);
        });

        it('overwrites a draggable with the same id', () => {
            const store = new DndStore();
            store.registerDraggable(makeDraggable('d1', { v: 1 }));
            const updated = makeDraggable('d1', { v: 2 });
            store.registerDraggable(updated);

            expect(store.getDraggable('d1')).toBe(updated);
            expect(store.getDraggables()).toHaveLength(1);
        });

        it('registers multiple draggables', () => {
            const store = new DndStore();
            store.registerDraggable(makeDraggable('d1'));
            store.registerDraggable(makeDraggable('d2'));
            store.registerDraggable(makeDraggable('d3'));

            expect(store.getDraggables()).toHaveLength(3);
        });
    });

    describe('droppables', () => {
        it('registers a droppable', () => {
            const store = new DndStore();
            const droppable = makeDroppable('p1');
            store.registerDroppable(droppable);

            expect(store.getDroppable('p1')).toBe(droppable);
            expect(store.getDroppables()).toHaveLength(1);
        });

        it('unregisters a droppable', () => {
            const store = new DndStore();
            store.registerDroppable(makeDroppable('p1'));
            store.unregisterDroppable('p1');

            expect(store.getDroppable('p1')).toBeUndefined();
            expect(store.getDroppables()).toHaveLength(0);
        });
    });

    describe('scrollables', () => {
        it('registers a scrollable', () => {
            const store = new DndStore();
            const scrollable = makeScrollable('s1');
            store.registerScrollable(scrollable);

            expect(store.getScrollable('s1')).toBe(scrollable);
            expect(store.getScrollables()).toHaveLength(1);
        });

        it('unregisters a scrollable', () => {
            const store = new DndStore();
            store.registerScrollable(makeScrollable('s1'));
            store.unregisterScrollable('s1');

            expect(store.getScrollable('s1')).toBeUndefined();
            expect(store.getScrollables()).toHaveLength(0);
        });
    });

    describe('state management', () => {
        it('updates state partially', () => {
            const store = new DndStore();
            store.updateState({ isDragging: true, coordinates: { x: 10, y: 20 } });

            const state = store.getState();
            expect(state.isDragging).toBe(true);
            expect(state.coordinates).toEqual({ x: 10, y: 20 });
            expect(state.draggable).toBeNull(); // unchanged
        });

        it('resetState returns to default', () => {
            const store = new DndStore();
            store.updateState({ isDragging: true, coordinates: { x: 100, y: 200 } });
            store.resetState();

            const state = store.getState();
            expect(state.isDragging).toBe(false);
            expect(state.coordinates).toEqual({ x: 0, y: 0 });
        });
    });

    describe('destroy', () => {
        it('clears all registered elements and resets state', () => {
            const store = new DndStore();
            store.registerDraggable(makeDraggable('d1'));
            store.registerDroppable(makeDroppable('p1'));
            store.registerScrollable(makeScrollable('s1'));
            store.updateState({ isDragging: true });

            store.destroy();

            expect(store.getDraggables()).toHaveLength(0);
            expect(store.getDroppables()).toHaveLength(0);
            expect(store.getScrollables()).toHaveLength(0);
            expect(store.getState().isDragging).toBe(false);
        });
    });
});
