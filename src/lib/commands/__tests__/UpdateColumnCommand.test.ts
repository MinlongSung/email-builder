import { describe, it, expect } from 'vitest';
import { UpdateColumnCommand } from '../structures/columns/UpdateColumnCommand';
import { createMockStore, createTemplate, createRow, createColumn } from './helpers';

describe('UpdateColumnCommand', () => {
    it('updates column width', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [], 50), createColumn('c2', [], 50)])
            ])
        );

        const cmd = new UpdateColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0,
            updates: { width: 75 }
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns[0].width).toBe(75);
        expect(store.template.root.rows[0].columns[1].width).toBe(50);
    });

    it('updates multiple properties at once', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [], 50)])
            ])
        );

        const cmd = new UpdateColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0,
            updates: {
                width: 60,
                style: { backgroundColor: 'blue' }
            }
        });

        cmd.execute();

        const column = store.template.root.rows[0].columns[0];
        expect(column.width).toBe(60);
        expect(column.style).toEqual({ backgroundColor: 'blue' });
    });

    it('undo restores previous column state', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [], 100)])
            ])
        );

        const cmd = new UpdateColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0,
            updates: { width: 25 }
        });

        cmd.execute();
        expect(store.template.root.rows[0].columns[0].width).toBe(25);

        cmd.undo();
        expect(store.template.root.rows[0].columns[0].width).toBe(100);
    });

    it('preserves unchanged properties during update', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [], 80)])
            ])
        );

        const originalId = store.template.root.rows[0].columns[0].id;
        const originalType = store.template.root.rows[0].columns[0].type;

        const cmd = new UpdateColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0,
            updates: { width: 90 }
        });

        cmd.execute();

        const column = store.template.root.rows[0].columns[0];
        expect(column.id).toBe(originalId);
        expect(column.type).toBe(originalType);
        expect(column.width).toBe(90);
    });

    it('updates only the specified column in a row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [], 33),
                    createColumn('c2', [], 33),
                    createColumn('c3', [], 34)
                ])
            ])
        );

        const cmd = new UpdateColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 1,
            updates: { width: 50 }
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns[0].width).toBe(33);
        expect(store.template.root.rows[0].columns[1].width).toBe(50);
        expect(store.template.root.rows[0].columns[2].width).toBe(34);
    });

    it('updates column in specific row without affecting other rows', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [], 50), createColumn('c2', [], 50)]),
                createRow('r2', [createColumn('c3', [], 60), createColumn('c4', [], 40)])
            ])
        );

        const cmd = new UpdateColumnCommand({
            store,
            rowIndex: 0,
            columnIndex: 0,
            updates: { width: 70 }
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns[0].width).toBe(70);
        expect(store.template.root.rows[1].columns[0].width).toBe(60);
    });
});
