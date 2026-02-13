import { describe, it, expect } from 'vitest';
import { UpdateRowCommand } from '../structures/rows/UpdateRowCommand';
import { createMockStore, createTemplate, createRow, createColumn } from './helpers';

describe('UpdateRowCommand', () => {
    it('applies partial updates to the row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [])]),
            ])
        );

        const cmd = new UpdateRowCommand({
            store,
            rowIndex: 0,
            updates: { separatorSize: 20 },
        });

        cmd.execute();

        const row = store.template.root.rows[0];
        expect(row.separatorSize).toBe(20);
    });

    it('applies style updates to row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [])]),
            ])
        );

        const cmd = new UpdateRowCommand({
            store,
            rowIndex: 0,
            updates: { style: { backgroundColor: 'red', padding: '10px' } },
        });

        cmd.execute();

        const row = store.template.root.rows[0];
        expect(row.style).toEqual({ backgroundColor: 'red', padding: '10px' });
    });

    it('applies isResponsive update', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [])]),
            ])
        );

        const cmd = new UpdateRowCommand({
            store,
            rowIndex: 0,
            updates: { isResponsive: false },
        });

        cmd.execute();

        const row = store.template.root.rows[0];
        expect(row.isResponsive).toBe(false);
    });

    it('undo restores the previous row state', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [])]),
            ])
        );

        const cmd = new UpdateRowCommand({
            store,
            rowIndex: 0,
            updates: { separatorSize: 30 },
        });

        cmd.execute();
        cmd.undo();

        const row = store.template.root.rows[0];
        expect(row.separatorSize).toBe(0); // Default value from createRow
    });

    it('preserves unchanged properties during update', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [])]),
            ])
        );

        const cmd = new UpdateRowCommand({
            store,
            rowIndex: 0,
            updates: { separatorSize: 15 },
        });

        cmd.execute();

        const row = store.template.root.rows[0];
        expect(row.id).toBe('r1');
        expect(row.type).toBe('row');
        expect(row.columns).toHaveLength(1);
    });
});
