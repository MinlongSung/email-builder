import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../history/EventEmitter';

type TestEvents = {
    foo: { value: number };
    bar: { message: string };
};

describe('EventEmitter', () => {
    it('calls listener when event is emitted', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();

        emitter.on('foo', listener);
        emitter.emit('foo', { value: 42 });

        expect(listener).toHaveBeenCalledWith({ value: 42 });
    });

    it('supports multiple listeners for the same event', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        emitter.on('foo', listener1);
        emitter.on('foo', listener2);
        emitter.emit('foo', { value: 1 });

        expect(listener1).toHaveBeenCalledOnce();
        expect(listener2).toHaveBeenCalledOnce();
    });

    it('does not call listeners of other events', () => {
        const emitter = new EventEmitter<TestEvents>();
        const fooListener = vi.fn();
        const barListener = vi.fn();

        emitter.on('foo', fooListener);
        emitter.on('bar', barListener);
        emitter.emit('foo', { value: 1 });

        expect(fooListener).toHaveBeenCalledOnce();
        expect(barListener).not.toHaveBeenCalled();
    });

    it('off removes a specific listener', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();

        emitter.on('foo', listener);
        emitter.off('foo', listener);
        emitter.emit('foo', { value: 1 });

        expect(listener).not.toHaveBeenCalled();
    });

    it('removeAllListeners clears all listeners', () => {
        const emitter = new EventEmitter<TestEvents>();
        const fooListener = vi.fn();
        const barListener = vi.fn();

        emitter.on('foo', fooListener);
        emitter.on('bar', barListener);
        emitter.removeAllListeners();

        emitter.emit('foo', { value: 1 });
        emitter.emit('bar', { message: 'hi' });

        expect(fooListener).not.toHaveBeenCalled();
        expect(barListener).not.toHaveBeenCalled();
    });

    it('on returns the emitter for chaining', () => {
        const emitter = new EventEmitter<TestEvents>();
        const result = emitter.on('foo', vi.fn());
        expect(result).toBe(emitter);
    });

    it('emit returns the emitter for chaining', () => {
        const emitter = new EventEmitter<TestEvents>();
        const result = emitter.emit('foo', { value: 1 });
        expect(result).toBe(emitter);
    });

    it('does not throw when emitting event with no listeners', () => {
        const emitter = new EventEmitter<TestEvents>();
        expect(() => emitter.emit('foo', { value: 1 })).not.toThrow();
    });
});
