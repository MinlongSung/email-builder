import { describe, it, expect } from 'vitest';
import { DeleteColumnCommand } from '../structures/columns/DeleteColumnCommand';
import { UpdateColumnCommand } from '../structures/columns/UpdateColumnCommand';
import { BatchCommand } from '../BatchCommands';
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

    describe('integer width distribution scenarios', () => {
        it('distributes width evenly when remainder is zero', () => {
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 30),
                        createColumn('c2', [], 30),
                        createColumn('c3', [], 40)
                    ])
                ])
            );

            const widthToDistribute = 40;
            const remainingColumns = 2;
            const widthBase = Math.floor(widthToDistribute / remainingColumns); // 20

            const batchCommand = new BatchCommand();

            batchCommand.add(
                new DeleteColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 2
                })
            );

            // c1: 30 + 20 = 50
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 30 + widthBase }
                })
            );

            // c2: 30 + 20 = 50
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 30 + widthBase }
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns).toHaveLength(2);
            expect(store.template.root.rows[0].columns[0].width).toBe(50);
            expect(store.template.root.rows[0].columns[1].width).toBe(50);
        });

        it('distributes remainder to first columns when division is not exact', () => {
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 25),
                        createColumn('c2', [], 25),
                        createColumn('c3', [], 25),
                        createColumn('c4', [], 25)
                    ])
                ])
            );

            const widthToDistribute = 25;
            const remainingColumns = 3;
            const widthBase = Math.floor(widthToDistribute / remainingColumns); // 8

            const batchCommand = new BatchCommand();

            batchCommand.add(
                new DeleteColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 3
                })
            );

            // c1 recibe el extra: 25 + 8 + 1 = 34
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 25 + widthBase + 1 }
                })
            );

            // c2: 25 + 8 = 33
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 25 + widthBase }
                })
            );

            // c3: 25 + 8 = 33
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 2,
                    updates: { width: 25 + widthBase }
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns).toHaveLength(3);
            expect(store.template.root.rows[0].columns[0].width).toBe(34);
            expect(store.template.root.rows[0].columns[1].width).toBe(33);
            expect(store.template.root.rows[0].columns[2].width).toBe(33);

            // Verificar que la suma es exacta
            const total = store.template.root.rows[0].columns.reduce((sum, col) => sum + col.width, 0);
            expect(total).toBe(100);
        });

        it('distributes remainder to first column when remainder is 1', () => {
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 30),
                        createColumn('c2', [], 30),
                        createColumn('c3', [], 30),
                        createColumn('c4', [], 10)
                    ])
                ])
            );

            const widthToDistribute = 10;
            const remainingColumns = 3;
            const widthBase = Math.floor(widthToDistribute / remainingColumns); // 3

            const batchCommand = new BatchCommand();

            batchCommand.add(
                new DeleteColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 3
                })
            );

            // c1 recibe el extra: 30 + 3 + 1 = 34
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 30 + widthBase + 1 }
                })
            );

            // c2: 30 + 3 = 33
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 30 + widthBase }
                })
            );

            // c3: 30 + 3 = 33
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 2,
                    updates: { width: 30 + widthBase }
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns[0].width).toBe(34);
            expect(store.template.root.rows[0].columns[1].width).toBe(33);
            expect(store.template.root.rows[0].columns[2].width).toBe(33);

            const total = store.template.root.rows[0].columns.reduce((sum, col) => sum + col.width, 0);
            expect(total).toBe(100);
        });

        it('undo reverses integer width distribution', () => {
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 25),
                        createColumn('c2', [], 25),
                        createColumn('c3', [], 25),
                        createColumn('c4', [], 25)
                    ])
                ])
            );

            const widthToDistribute = 25;
            const remainingColumns = 3;
            const widthBase = Math.floor(widthToDistribute / remainingColumns);

            const batchCommand = new BatchCommand();

            batchCommand.add(
                new DeleteColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 3
                })
            );

            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 25 + widthBase + 1 }
                })
            );

            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1,
                    updates: { width: 25 + widthBase }
                })
            );

            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 2,
                    updates: { width: 25 + widthBase }
                })
            );

            batchCommand.execute();
            batchCommand.undo();

            expect(store.template.root.rows[0].columns).toHaveLength(4);
            expect(store.template.root.rows[0].columns[0].width).toBe(25);
            expect(store.template.root.rows[0].columns[1].width).toBe(25);
            expect(store.template.root.rows[0].columns[2].width).toBe(25);
            expect(store.template.root.rows[0].columns[3].width).toBe(25);
        });

        it('handles deletion leaving single column', () => {
            const store = createMockStore(
                createTemplate([
                    createRow('r1', [
                        createColumn('c1', [], 40),
                        createColumn('c2', [], 60)
                    ])
                ])
            );

            const widthToDistribute = 60;
            const remainingColumns = 1;
            const widthBase = Math.floor(widthToDistribute / remainingColumns); // 60

            const batchCommand = new BatchCommand();

            batchCommand.add(
                new DeleteColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 1
                })
            );

            // c1: 40 + 60 = 100
            batchCommand.add(
                new UpdateColumnCommand({
                    store,
                    rowIndex: 0,
                    columnIndex: 0,
                    updates: { width: 40 + widthBase }
                })
            );

            batchCommand.execute();

            expect(store.template.root.rows[0].columns).toHaveLength(1);
            expect(store.template.root.rows[0].columns[0].width).toBe(100);
        });
    });
});
