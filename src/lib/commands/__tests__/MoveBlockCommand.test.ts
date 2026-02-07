import { describe, it, expect } from 'vitest';
import { MoveBlockCommand } from '../blocks/MoveBlockCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('MoveBlockCommand', () => {
    it('moves a block within the same column', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [createTextBlock('b1'), createTextBlock('b2'), createTextBlock('b3')]),
                ]),
            ])
        );

        const cmd = new MoveBlockCommand({
            store,
            from: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            to: { rowIndex: 0, columnIndex: 0, blockIndex: 2 },
        });

        cmd.execute();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks.map((b) => b.id)).toEqual(['b2', 'b3', 'b1']);
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('moves a block between different columns', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [createTextBlock('b1')]),
                    createColumn('c2', [createTextBlock('b2')]),
                ]),
            ])
        );

        const cmd = new MoveBlockCommand({
            store,
            from: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            to: { rowIndex: 0, columnIndex: 1, blockIndex: 1 },
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns[0].blocks).toHaveLength(0);
        expect(store.template.root.rows[0].columns[1].blocks.map((b) => b.id)).toEqual(['b2', 'b1']);
    });

    it('moves a block between different rows', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1')])]),
                createRow('r2', [createColumn('c2', [])]),
            ])
        );

        const cmd = new MoveBlockCommand({
            store,
            from: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            to: { rowIndex: 1, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();

        expect(store.template.root.rows[0].columns[0].blocks).toHaveLength(0);
        expect(store.template.root.rows[1].columns[0].blocks[0].id).toBe('b1');
    });

    it('undo restores the block to its original position', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [createTextBlock('b1')]),
                    createColumn('c2', []),
                ]),
            ])
        );

        const cmd = new MoveBlockCommand({
            store,
            from: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            to: { rowIndex: 0, columnIndex: 1, blockIndex: 0 },
        });

        cmd.execute();
        cmd.undo();

        expect(store.template.root.rows[0].columns[0].blocks[0].id).toBe('b1');
        expect(store.template.root.rows[0].columns[1].blocks).toHaveLength(0);
    });
});
