import { describe, it, expect } from 'vitest';
import { AddBlockCommand } from '../blocks/AddBlockCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('AddBlockCommand', () => {
    it('inserts a block at the specified position', () => {
        const store = createMockStore(
            createTemplate([createRow('r1', [createColumn('c1', [createTextBlock('b1')])])])
        );
        const newBlock = createTextBlock('new-block');

        const cmd = new AddBlockCommand({
            store,
            block: newBlock,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 1 },
        });

        cmd.execute();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks).toHaveLength(2);
        expect(blocks[0].id).toBe('b1');
        // The command clones with a new ID, so it won't match 'new-block'
        expect(blocks[1].type).toBe('text');
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('inserts at the beginning when blockIndex is 0', () => {
        const store = createMockStore(
            createTemplate([createRow('r1', [createColumn('c1', [createTextBlock('b1')])])])
        );

        const cmd = new AddBlockCommand({
            store,
            block: createTextBlock('new'),
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks).toHaveLength(2);
        expect(blocks[1].id).toBe('b1');
    });

    it('undo removes the inserted block', () => {
        const store = createMockStore(
            createTemplate([createRow('r1', [createColumn('c1')])])
        );

        const cmd = new AddBlockCommand({
            store,
            block: createTextBlock('new'),
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();
        expect(store.template.root.rows[0].columns[0].blocks).toHaveLength(1);

        cmd.undo();
        expect(store.template.root.rows[0].columns[0].blocks).toHaveLength(0);
    });

    it('clones the block with a new ID', () => {
        const store = createMockStore(
            createTemplate([createRow('r1', [createColumn('c1')])])
        );
        const original = createTextBlock('original-id');

        const cmd = new AddBlockCommand({
            store,
            block: original,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();

        const inserted = store.template.root.rows[0].columns[0].blocks[0];
        expect(inserted.id).not.toBe('original-id');
        expect(inserted.type).toBe('text');
    });
});
