import { describe, it, expect } from 'vitest';
import { AddRowCommand } from '../structures/rows/AddRowCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('AddRowCommand', () => {
    it('inserts a row at the specified index', () => {
        const store = createMockStore(createTemplate([createRow('r1')]));
        const newRow = createRow('new-row');

        const cmd = new AddRowCommand({ store, row: newRow, index: 1 });
        cmd.execute();

        expect(store.template.root.rows).toHaveLength(2);
        expect(store.template.root.rows[0].id).toBe('r1');
        // Cloned with new ID
        expect(store.template.root.rows[1].type).toBe('row');
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('inserts at the beginning', () => {
        const store = createMockStore(createTemplate([createRow('r1')]));

        const cmd = new AddRowCommand({ store, row: createRow('new'), index: 0 });
        cmd.execute();

        expect(store.template.root.rows).toHaveLength(2);
        expect(store.template.root.rows[1].id).toBe('r1');
    });

    it('clones the row with new IDs for row, columns, and blocks', () => {
        const store = createMockStore(createTemplate([]));
        const row = createRow('orig-row', [
            createColumn('orig-col', [createTextBlock('orig-block')]),
        ]);

        const cmd = new AddRowCommand({ store, row, index: 0 });
        cmd.execute();

        const inserted = store.template.root.rows[0];
        expect(inserted.id).not.toBe('orig-row');
        expect(inserted.columns[0].id).not.toBe('orig-col');
        expect(inserted.columns[0].blocks[0].id).not.toBe('orig-block');
    });

    it('undo removes the inserted row', () => {
        const store = createMockStore(createTemplate([]));

        const cmd = new AddRowCommand({ store, row: createRow('new'), index: 0 });
        cmd.execute();
        expect(store.template.root.rows).toHaveLength(1);

        cmd.undo();
        expect(store.template.root.rows).toHaveLength(0);
    });
});
