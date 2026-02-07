import { describe, it, expect } from 'vitest';
import { DeleteRowCommand } from '../structures/DeleteRowCommand';
import { createMockStore, createTemplate, createRow } from './helpers';

describe('DeleteRowCommand', () => {
    it('removes the row at the specified index', () => {
        const store = createMockStore(createTemplate([createRow('r1'), createRow('r2')]));

        const cmd = new DeleteRowCommand({ store, index: 0 });
        cmd.execute();

        expect(store.template.root.rows).toHaveLength(1);
        expect(store.template.root.rows[0].id).toBe('r2');
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('undo restores the deleted row at the original index', () => {
        const store = createMockStore(createTemplate([createRow('r1'), createRow('r2'), createRow('r3')]));

        const cmd = new DeleteRowCommand({ store, index: 1 });
        cmd.execute();
        expect(store.template.root.rows.map((r) => r.id)).toEqual(['r1', 'r3']);

        cmd.undo();
        expect(store.template.root.rows.map((r) => r.id)).toEqual(['r1', 'r2', 'r3']);
    });

    it('removes the last remaining row', () => {
        const store = createMockStore(createTemplate([createRow('r1')]));

        const cmd = new DeleteRowCommand({ store, index: 0 });
        cmd.execute();

        expect(store.template.root.rows).toHaveLength(0);
    });
});
