import { describe, it, expect } from 'vitest';
import { AddColumnCommand } from '../structures/columns/AddColumnCommand';
import { createMockStore, createTemplate, createRow, createColumn } from './helpers';

describe('AddColumnCommand', () => {
    it('adds a new column to the row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2')])
            ])
        );

        const newColumn = createColumn('c3', [], 20);

        const cmd = new AddColumnCommand({
            store,
            rowIndex: 0,
            column: newColumn,
            columnIndex: 2
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(3);
        expect(store.template.root.rows[0].columns[2].id).toBe('c3');
        expect(store.template.root.rows[0].columns[2].width).toBe(20);
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('adds a column at the beginning', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2')])
            ])
        );

        const newColumn = createColumn('c0', [], 15);

        const cmd = new AddColumnCommand({
            store,
            rowIndex: 0,
            column: newColumn,
            columnIndex: 0
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(3);
        expect(store.template.root.rows[0].columns[0].id).toBe('c0');
        expect(store.template.root.rows[0].columns[1].id).toBe('c1');
        expect(store.template.root.rows[0].columns[2].id).toBe('c2');
    });

    it('adds a column in the middle', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2'), createColumn('c3')])
            ])
        );

        const newColumn = createColumn('c-new', [], 10);

        const cmd = new AddColumnCommand({
            store,
            rowIndex: 0,
            column: newColumn,
            columnIndex: 1
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(4);
        expect(store.template.root.rows[0].columns.map(c => c.id)).toEqual(['c1', 'c-new', 'c2', 'c3']);
    });

    it('undo removes the added column', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2')])
            ])
        );

        const newColumn = createColumn('c3', [], 20);

        const cmd = new AddColumnCommand({
            store,
            rowIndex: 0,
            column: newColumn,
            columnIndex: 2
        });

        cmd.execute();
        cmd.undo();

        expect(store.template.root.rows[0].columns).toHaveLength(2);
        expect(store.template.root.rows[0].columns.map(c => c.id)).toEqual(['c1', 'c2']);
    });

    it('preserves existing column properties when adding', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 50),
                    createColumn('c2', [], 50)
                ])
            ])
        );

        const newColumn = createColumn('c3', [], 25);

        const cmd = new AddColumnCommand({
            store,
            rowIndex: 0,
            column: newColumn,
            columnIndex: 2
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns[0].width).toBe(50);
        expect(store.template.root.rows[0].columns[1].width).toBe(50);
        expect(store.template.root.rows[0].columns[2].width).toBe(25);
    });

    it('adds column to specific row without affecting others', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1'), createColumn('c2')]),
                createRow('r2', [createColumn('c3'), createColumn('c4')])
            ])
        );

        const newColumn = createColumn('c-new', [], 30);

        const cmd = new AddColumnCommand({
            store,
            rowIndex: 1,
            column: newColumn,
            columnIndex: 2
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns).toHaveLength(2);
        expect(store.template.root.rows[1].columns).toHaveLength(3);
        expect(store.template.root.rows[1].columns[2].id).toBe('c-new');
    });
});
