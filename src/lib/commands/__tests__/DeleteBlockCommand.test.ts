import { describe, it, expect } from 'vitest';
import { DeleteBlockCommand } from '../blocks/DeleteBlockCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('DeleteBlockCommand', () => {
    it('removes the block at the specified position', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1'), createTextBlock('b2')])]),
            ])
        );

        const cmd = new DeleteBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks).toHaveLength(1);
        expect(blocks[0].id).toBe('b2');
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('undo restores the deleted block at the original position', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1'), createTextBlock('b2')])]),
            ])
        );

        const cmd = new DeleteBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();
        cmd.undo();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks).toHaveLength(2);
        expect(blocks[0].id).toBe('b1');
        expect(blocks[1].id).toBe('b2');
    });

    it('removes the last block leaving an empty column', () => {
        const store = createMockStore(
            createTemplate([createRow('r1', [createColumn('c1', [createTextBlock('b1')])])])
        );

        const cmd = new DeleteBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
        });

        cmd.execute();
        expect(store.template.root.rows[0].columns[0].blocks).toHaveLength(0);
    });
});
