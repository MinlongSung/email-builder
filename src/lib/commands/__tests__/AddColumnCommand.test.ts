import { describe, it, expect } from 'vitest';
import { AddColumnCommand } from '../structures/columns/AddColumnCommand';
import { UpdateColumnCommand } from '../structures/columns/UpdateColumnCommand';
import { BatchCommand } from '../BatchCommands';
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

    describe('width distribution scenarios', () => {
        it('distributes width from single column when adding new column', () => {
            const MIN_WIDTH = 5;
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 50),
                        createColumn('c2', [], 50)
                    ])
                ])
            );

            const newColumn = createColumn('c3', [], MIN_WIDTH);
            const batchCommand = new BatchCommand();

            // Restar MIN_WIDTH de la columna con mayor width
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 50 - MIN_WIDTH }
                })
            );

            batchCommand.add(
                new AddColumnCommand({
                    store,
                    rowIndex: 0,
                    column: newColumn,
                    columnIndex: 2
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns).toHaveLength(3);
            expect(store.template.root.rows[0].columns[0].width).toBe(45);
            expect(store.template.root.rows[0].columns[1].width).toBe(50);
            expect(store.template.root.rows[0].columns[2].width).toBe(5);
        });

        it('distributes width from multiple columns when single column cannot provide enough', () => {
            const MIN_WIDTH = 5;
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 7),
                        createColumn('c2', [], 8)
                    ])
                ])
            );

            const newColumn = createColumn('c3', [], MIN_WIDTH);
            const batchCommand = new BatchCommand();

            // c2 (8%) puede ceder 3% (queda en 5%)
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 5 }
                })
            );

            // c1 (7%) puede ceder 2% (queda en 5%)
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 5 }
                })
            );

            batchCommand.add(
                new AddColumnCommand({
                    store,
                    rowIndex: 0,
                    column: newColumn,
                    columnIndex: 2
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns).toHaveLength(3);
            expect(store.template.root.rows[0].columns[0].width).toBe(5);
            expect(store.template.root.rows[0].columns[1].width).toBe(5);
            expect(store.template.root.rows[0].columns[2].width).toBe(5);
        });

        it('undo reverses width distribution when adding column', () => {
            const MIN_WIDTH = 5;
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 7),
                        createColumn('c2', [], 8)
                    ])
                ])
            );

            const newColumn = createColumn('c3', [], MIN_WIDTH);
            const batchCommand = new BatchCommand();

            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 5 }
                })
            );

            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 5 }
                })
            );

            batchCommand.add(
                new AddColumnCommand({
                    store,
                    rowIndex: 0,
                    column: newColumn,
                    columnIndex: 2
                })
            );

            batchCommand.execute();
            batchCommand.undo();

            expect(store.template.root.rows[0].columns).toHaveLength(2);
            expect(store.template.root.rows[0].columns[0].width).toBe(7);
            expect(store.template.root.rows[0].columns[1].width).toBe(8);
        });

        it('distributes width proportionally from three columns', () => {
            const MIN_WIDTH = 5;
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 6),
                        createColumn('c2', [], 6),
                        createColumn('c3', [], 8)
                    ])
                ])
            );

            const newColumn = createColumn('c4', [], MIN_WIDTH);
            const batchCommand = new BatchCommand();

            // c3 (8%) puede ceder 3% (queda en 5%)
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 2,
                    updates: { width: 5 }
                })
            );

            // c1 (6%) puede ceder 1% (queda en 5%)
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 5 }
                })
            );

            // c2 (6%) puede ceder 1% (queda en 5%)
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 5 }
                })
            );

            batchCommand.add(
                new AddColumnCommand({
                    store,
                    rowIndex: 0,
                    column: newColumn,
                    columnIndex: 3
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns).toHaveLength(4);
            expect(store.template.root.rows[0].columns[0].width).toBe(5);
            expect(store.template.root.rows[0].columns[1].width).toBe(5);
            expect(store.template.root.rows[0].columns[2].width).toBe(5);
            expect(store.template.root.rows[0].columns[3].width).toBe(5);
        });
    });
});
