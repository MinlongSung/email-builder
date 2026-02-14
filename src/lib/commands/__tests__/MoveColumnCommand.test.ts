import { describe, it, expect } from 'vitest';
import { MoveColumnCommand } from '../structures/columns/MoveColumnCommand';
import { createMockStore, createTemplate, createRow, createColumn } from './helpers';

describe('MoveColumnCommand', () => {
    it('moves a column forward within a row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1'),
                    createColumn('c2'),
                    createColumn('c3')
                ])
            ])
        );

        const cmd = new MoveColumnCommand({ store, rowIndex: 0, from: 0, to: 2 });
        cmd.execute();

        expect(store.template.root.rows[0].columns.map((c) => c.id)).toEqual(['c2', 'c3', 'c1']);
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('moves a column backward within a row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1'),
                    createColumn('c2'),
                    createColumn('c3')
                ])
            ])
        );

        const cmd = new MoveColumnCommand({ store, rowIndex: 0, from: 2, to: 0 });
        cmd.execute();

        expect(store.template.root.rows[0].columns.map((c) => c.id)).toEqual(['c3', 'c1', 'c2']);
    });

    it('moves a column to adjacent position', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1'),
                    createColumn('c2'),
                    createColumn('c3')
                ])
            ])
        );

        const cmd = new MoveColumnCommand({ store, rowIndex: 0, from: 0, to: 1 });
        cmd.execute();

        expect(store.template.root.rows[0].columns.map((c) => c.id)).toEqual(['c2', 'c1', 'c3']);
    });

    it('undo restores the original column order', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1'),
                    createColumn('c2'),
                    createColumn('c3')
                ])
            ])
        );

        const cmd = new MoveColumnCommand({ store, rowIndex: 0, from: 0, to: 2 });
        cmd.execute();
        cmd.undo();

        expect(store.template.root.rows[0].columns.map((c) => c.id)).toEqual(['c1', 'c2', 'c3']);
    });

    it('handles moving columns in multiple rows independently', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2')]),
                createRow('r2', [createColumn('c3'), createColumn('c4')])
            ])
        );

        const cmd = new MoveColumnCommand({ store, rowIndex: 1, from: 0, to: 1 });
        cmd.execute();

        // First row should be unchanged
        expect(store.template.root.rows[0].columns.map((c) => c.id)).toEqual(['c1', 'c2']);
        // Second row should have columns moved
        expect(store.template.root.rows[1].columns.map((c) => c.id)).toEqual(['c4', 'c3']);
    });

    it('preserves column properties during move', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 100),
                    createColumn('c2', [], 200),
                    createColumn('c3', [], 300)
                ])
            ])
        );

        const cmd = new MoveColumnCommand({ store, rowIndex: 0, from: 0, to: 2 });
        cmd.execute();

        const columns = store.template.root.rows[0].columns;
        expect(columns[0].width).toBe(200);
        expect(columns[1].width).toBe(300);
        expect(columns[2].width).toBe(100);
    });
});
