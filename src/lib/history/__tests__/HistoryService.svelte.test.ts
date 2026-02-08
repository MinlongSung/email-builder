import { describe, it, expect, vi } from 'vitest';
import { HistoryService } from '../HistoryService.svelte';
import type { Command } from '../../commands/Command';

function createSpyCommand(): Command & { executeCalls: number; undoCalls: number } {
    const cmd = {
        executeCalls: 0,
        undoCalls: 0,
        execute() { this.executeCalls++; },
        undo() { this.undoCalls++; },
    };
    return cmd;
}

function makeMeta(type: string = 'block.add') {
    return { type } as any;
}

describe('HistoryService', () => {
    it('starts with empty timeline', () => {
        const service = new HistoryService();
        expect(service.getTimeline()).toHaveLength(0);
        expect(service.getCurrentIndex()).toBe(-1);
    });

    it('starts with canUndo false and canRedo false', () => {
        const service = new HistoryService();
        expect(service.canUndo()).toBe(false);
        expect(service.canRedo()).toBe(false);
    });

    it('executeCommand runs the command and adds to timeline', () => {
        const service = new HistoryService();
        const cmd = createSpyCommand();

        service.executeCommand(cmd, makeMeta());

        expect(cmd.executeCalls).toBe(1);
        expect(service.getTimeline()).toHaveLength(1);
        expect(service.getCurrentIndex()).toBe(0);
    });

    it('canUndo is true after executing a command', () => {
        const service = new HistoryService();
        service.executeCommand(createSpyCommand(), makeMeta());
        expect(service.canUndo()).toBe(true);
        expect(service.canRedo()).toBe(false);
    });

    it('undo reverses the last command', () => {
        const service = new HistoryService();
        const cmd = createSpyCommand();
        service.executeCommand(cmd, makeMeta());

        service.undo();

        expect(cmd.undoCalls).toBe(1);
        expect(service.getCurrentIndex()).toBe(-1);
        expect(service.canUndo()).toBe(false);
        expect(service.canRedo()).toBe(true);
    });

    it('redo re-executes an undone command', () => {
        const service = new HistoryService();
        const cmd = createSpyCommand();
        service.executeCommand(cmd, makeMeta());
        service.undo();

        service.redo();

        expect(cmd.executeCalls).toBe(2); // initial + redo
        expect(service.getCurrentIndex()).toBe(0);
        expect(service.canUndo()).toBe(true);
        expect(service.canRedo()).toBe(false);
    });

    it('undo does nothing when timeline is empty', () => {
        const service = new HistoryService();
        service.undo(); // should not throw
        expect(service.getCurrentIndex()).toBe(-1);
    });

    it('redo does nothing when at the end of timeline', () => {
        const service = new HistoryService();
        service.executeCommand(createSpyCommand(), makeMeta());
        service.redo(); // should not throw
        expect(service.getCurrentIndex()).toBe(0);
    });

    it('executing a new command after undo discards the redo stack', () => {
        const service = new HistoryService();
        const cmd1 = createSpyCommand();
        const cmd2 = createSpyCommand();
        const cmd3 = createSpyCommand();

        service.executeCommand(cmd1, makeMeta());
        service.executeCommand(cmd2, makeMeta());
        service.undo(); // undo cmd2

        service.executeCommand(cmd3, makeMeta());

        expect(service.getTimeline()).toHaveLength(2); // cmd1 + cmd3
        expect(service.canRedo()).toBe(false);
    });

    it('respects the MAX_CHANGES limit of 200', () => {
        const service = new HistoryService();

        for (let i = 0; i < 210; i++) {
            service.executeCommand(createSpyCommand(), makeMeta());
        }

        expect(service.getTimeline()).toHaveLength(200);
    });

    it('goTo moves forward in timeline', () => {
        const service = new HistoryService();
        const cmds = Array.from({ length: 5 }, () => createSpyCommand());

        for (const cmd of cmds) {
            service.executeCommand(cmd, makeMeta());
        }

        // Go back to start
        service.goTo(-1);
        expect(service.getCurrentIndex()).toBe(-1);

        // Go forward to index 2
        service.goTo(2);
        expect(service.getCurrentIndex()).toBe(2);
        // cmds 0, 1, 2 should have been re-executed
        expect(cmds[0].executeCalls).toBe(2);
        expect(cmds[1].executeCalls).toBe(2);
        expect(cmds[2].executeCalls).toBe(2);
    });

    it('goTo moves backward in timeline', () => {
        const service = new HistoryService();
        const cmds = Array.from({ length: 5 }, () => createSpyCommand());

        for (const cmd of cmds) {
            service.executeCommand(cmd, makeMeta());
        }

        service.goTo(1);

        expect(service.getCurrentIndex()).toBe(1);
        // cmds 4, 3, 2 should have been undone
        expect(cmds[4].undoCalls).toBe(1);
        expect(cmds[3].undoCalls).toBe(1);
        expect(cmds[2].undoCalls).toBe(1);
    });

    it('goTo ignores invalid indices', () => {
        const service = new HistoryService();
        service.executeCommand(createSpyCommand(), makeMeta());

        service.goTo(-2); // invalid
        expect(service.getCurrentIndex()).toBe(0);

        service.goTo(100); // invalid
        expect(service.getCurrentIndex()).toBe(0);
    });

    it('clear resets the timeline', () => {
        const service = new HistoryService();
        service.executeCommand(createSpyCommand(), makeMeta());
        service.executeCommand(createSpyCommand(), makeMeta());

        service.clear();

        expect(service.getTimeline()).toHaveLength(0);
        expect(service.getCurrentIndex()).toBe(-1);
        expect(service.canUndo()).toBe(false);
        expect(service.canRedo()).toBe(false);
    });

    it('emits execute event when a command is executed', () => {
        const service = new HistoryService();
        const listener = vi.fn();
        service.on('execute', listener);

        service.executeCommand(createSpyCommand(), makeMeta());

        expect(listener).toHaveBeenCalledOnce();
        expect(listener.mock.calls[0][0]).toHaveProperty('entry');
    });

    it('emits undo event', () => {
        const service = new HistoryService();
        const listener = vi.fn();
        service.on('undo', listener);

        service.executeCommand(createSpyCommand(), makeMeta());
        service.undo();

        expect(listener).toHaveBeenCalledOnce();
    });

    it('emits redo event', () => {
        const service = new HistoryService();
        const listener = vi.fn();
        service.on('redo', listener);

        service.executeCommand(createSpyCommand(), makeMeta());
        service.undo();
        service.redo();

        expect(listener).toHaveBeenCalledOnce();
    });

    it('emits goto event', () => {
        const service = new HistoryService();
        const listener = vi.fn();
        service.on('goto', listener);

        service.executeCommand(createSpyCommand(), makeMeta());
        service.executeCommand(createSpyCommand(), makeMeta());
        service.goTo(0);

        expect(listener).toHaveBeenCalledWith({ from: 1, to: 0 });
    });
});
