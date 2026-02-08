import { describe, it, expect } from 'vitest';
import { MoveRowCommand } from '../structures/rows/MoveRowCommand';
import { createMockStore, createTemplate, createRow } from './helpers';

describe('MoveRowCommand', () => {
    it('moves a row forward', () => {
        const store = createMockStore(
            createTemplate([createRow('r1'), createRow('r2'), createRow('r3')])
        );

        const cmd = new MoveRowCommand({ store, from: 0, to: 2 });
        cmd.execute();

        expect(store.template.root.rows.map((r) => r.id)).toEqual(['r2', 'r3', 'r1']);
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('moves a row backward', () => {
        const store = createMockStore(
            createTemplate([createRow('r1'), createRow('r2'), createRow('r3')])
        );

        const cmd = new MoveRowCommand({ store, from: 2, to: 0 });
        cmd.execute();

        expect(store.template.root.rows.map((r) => r.id)).toEqual(['r3', 'r1', 'r2']);
    });

    it('undo restores the original order', () => {
        const store = createMockStore(
            createTemplate([createRow('r1'), createRow('r2'), createRow('r3')])
        );

        const cmd = new MoveRowCommand({ store, from: 0, to: 2 });
        cmd.execute();
        cmd.undo();

        expect(store.template.root.rows.map((r) => r.id)).toEqual(['r1', 'r2', 'r3']);
    });
});
