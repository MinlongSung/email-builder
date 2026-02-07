// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { DndManager } from '../DndManager';
import type { Draggable, Droppable, Scrollable, SensorDescriptor } from '../types';
import { MouseSensor } from '../sensors/MouseSensor';

function mockElement(): HTMLElement {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({
        left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}),
    });
    return el;
}

function makeDraggable(id: string, data: any = {}): Draggable {
    return { id, data, element: mockElement() };
}

function makeDroppable(id: string, data: any = {}): Droppable {
    return { id, data, element: mockElement() };
}

function makeScrollable(id: string): Scrollable {
    const el = mockElement();
    el.scrollBy = vi.fn();
    return { id, element: el };
}

describe('DndManager', () => {
    describe('registration', () => {
        it('registers and creates listeners for a draggable', () => {
            const sensors: SensorDescriptor[] = [
                [MouseSensor, { activationConstraint: {} }],
            ];
            const manager = new DndManager({ sensors });

            const draggable = makeDraggable('d1', { type: 'block' });
            manager.registerDraggable(draggable);

            const listeners = manager.createListeners('d1');
            expect(listeners).toHaveProperty('mousedown');
            expect(typeof listeners.mousedown).toBe('function');
        });

        it('does not crash when creating listeners with no sensors', () => {
            const manager = new DndManager({});
            const listeners = manager.createListeners('d1');
            expect(listeners).toEqual({});
        });

        it('ignores disabled draggables', () => {
            const sensors: SensorDescriptor[] = [
                [MouseSensor, { activationConstraint: {} }],
            ];
            const callbacks = { onDragStart: vi.fn() };
            const manager = new DndManager({ sensors, callbacks });

            const draggable = makeDraggable('d1');
            draggable.disabled = true;
            manager.registerDraggable(draggable);

            const listeners = manager.createListeners('d1');
            const event = new MouseEvent('mousedown', { button: 0 });
            listeners.mousedown(event);

            expect(callbacks.onDragStart).not.toHaveBeenCalled();
        });

        it('ignores unregistered draggable IDs', () => {
            const sensors: SensorDescriptor[] = [
                [MouseSensor, { activationConstraint: {} }],
            ];
            const callbacks = { onDragStart: vi.fn() };
            const manager = new DndManager({ sensors, callbacks });

            // Don't register any draggable
            const listeners = manager.createListeners('nonexistent');
            const event = new MouseEvent('mousedown', { button: 0 });
            listeners.mousedown(event);

            expect(callbacks.onDragStart).not.toHaveBeenCalled();
        });
    });

    describe('droppables and scrollables', () => {
        it('registers and unregisters droppables', () => {
            const manager = new DndManager({});
            const droppable = makeDroppable('p1');

            manager.registerDroppable(droppable);
            manager.unregisterDroppable('p1');
            // No public getter, but destroy should not throw
            manager.destroy();
        });

        it('registers and unregisters scrollables', () => {
            const manager = new DndManager({});
            const scrollable = makeScrollable('s1');

            manager.registerScrollable(scrollable);
            manager.unregisterScrollable('s1');
            manager.destroy();
        });
    });

    describe('event emitter', () => {
        it('supports on/off/emit for drag events', () => {
            const manager = new DndManager({});
            const listener = vi.fn();

            manager.on('dragCancel', listener);
            manager.emit('dragCancel');

            expect(listener).toHaveBeenCalledOnce();

            manager.off('dragCancel', listener);
            manager.emit('dragCancel');

            expect(listener).toHaveBeenCalledOnce(); // not called again
        });
    });

    describe('destroy', () => {
        it('cleans up without errors', () => {
            const manager = new DndManager({
                sensors: [[MouseSensor, { activationConstraint: {} }]],
            });

            manager.registerDraggable(makeDraggable('d1'));
            manager.registerDroppable(makeDroppable('p1'));
            manager.registerScrollable(makeScrollable('s1'));

            expect(() => manager.destroy()).not.toThrow();
        });
    });
});
