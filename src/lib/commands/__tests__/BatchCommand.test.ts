import { describe, it, expect, vi } from 'vitest';
import { BatchCommand } from '../BatchCommands';
import type { Command } from '../Command';

function createSpyCommand(): Command {
    return {
        execute: vi.fn(),
        undo: vi.fn(),
    };
}

describe('BatchCommand', () => {
    it('starts empty', () => {
        const batch = new BatchCommand();
        expect(batch.isEmpty()).toBe(true);
    });

    it('accepts commands via constructor', () => {
        const batch = new BatchCommand([createSpyCommand()]);
        expect(batch.isEmpty()).toBe(false);
    });

    it('accepts commands via add()', () => {
        const batch = new BatchCommand();
        batch.add(createSpyCommand());
        expect(batch.isEmpty()).toBe(false);
    });

    it('execute runs all commands in order', () => {
        const order: number[] = [];
        const cmd1: Command = { execute: () => order.push(1), undo: vi.fn() };
        const cmd2: Command = { execute: () => order.push(2), undo: vi.fn() };
        const cmd3: Command = { execute: () => order.push(3), undo: vi.fn() };

        const batch = new BatchCommand([cmd1, cmd2, cmd3]);
        batch.execute();

        expect(order).toEqual([1, 2, 3]);
    });

    it('undo runs all commands in reverse order', () => {
        const order: number[] = [];
        const cmd1: Command = { execute: vi.fn(), undo: () => order.push(1) };
        const cmd2: Command = { execute: vi.fn(), undo: () => order.push(2) };
        const cmd3: Command = { execute: vi.fn(), undo: () => order.push(3) };

        const batch = new BatchCommand([cmd1, cmd2, cmd3]);
        batch.undo();

        expect(order).toEqual([3, 2, 1]);
    });

    it('execute then undo restores original state', () => {
        let value = 0;
        const cmd: Command = {
            execute: () => { value += 10; },
            undo: () => { value -= 10; },
        };

        const batch = new BatchCommand([cmd]);
        batch.execute();
        expect(value).toBe(10);

        batch.undo();
        expect(value).toBe(0);
    });
});
