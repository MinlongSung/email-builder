import { describe, it, expect } from 'vitest';
import { DeleteColumnCommand } from '../structures/columns/DeleteColumnCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('DeleteColumnCommand', () => {
    it('deletes a column from the row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 33),
                    createColumn('c2', [], 33),
                    createColumn('c3', [], 34)
                ])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 1
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(2);
        expect(store.template.root.rows[0].columns.map(c => c.id)).toEqual(['c1', 'c3']);
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('deletes the first column', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 25),
                    createColumn('c2', [], 75)
                ])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(1);
        expect(store.template.root.rows[0].columns[0].id).toBe('c2');
    });

    it('deletes the last column', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 40),
                    createColumn('c2', [], 60)
                ])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 1
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(1);
        expect(store.template.root.rows[0].columns[0].id).toBe('c1');
    });

    it('undo restores the deleted column', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 50),
                    createColumn('c2', [], 50)
                ])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0
        });

        cmd.execute();
        expect(store.template.root.rows[0].columns).toHaveLength(1);

        cmd.undo();
        expect(store.template.root.rows[0].columns).toHaveLength(2);
        expect(store.template.root.rows[0].columns[0].id).toBe('c1');
        expect(store.template.root.rows[0].columns[0].width).toBe(50);
    });

    it('preserves column properties when restoring', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [createTextBlock('b1')], 70),
                    createColumn('c2', [], 30)
                ])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0
        });

        cmd.execute();
        cmd.undo();

        const restoredColumn = store.template.root.rows[0].columns[0];
        expect(restoredColumn.id).toBe('c1');
        expect(restoredColumn.width).toBe(70);
        expect(restoredColumn.blocks).toHaveLength(1);
        expect(restoredColumn.blocks[0].id).toBe('b1');
    });

    it('deletes column from specific row without affecting other rows', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2')]),
                createRow('r2', [createColumn('c3'), createColumn('c4'), createColumn('c5')])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 1,
            columnIndex: 1
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(2);
        expect(store.template.root.rows[1].columns).toHaveLength(2);
        expect(store.template.root.rows[1].columns.map(c => c.id)).toEqual(['c3', 'c5']);
    });

    it('restores column to correct position on undo', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1'),
                    createColumn('c2'),
                    createColumn('c3'),
                    createColumn('c4')
                ])
            ])
        );

        const cmd = new DeleteColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 2
        });

        cmd.execute();
        expect(store.template.root.rows[0].columns.map(c => c.id)).toEqual(['c1', 'c2', 'c4']);

        cmd.undo();
        expect(store.template.root.rows[0].columns.map(c => c.id)).toEqual(['c1', 'c2', 'c3', 'c4']);
    });
});
