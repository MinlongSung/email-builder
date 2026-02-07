import { describe, it, expect } from 'vitest';
import { CloneBlockCommand } from '../blocks/CloneBlockCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('CloneBlockCommand', () => {
    it('clones a block to the target position', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1')])]),
            ])
        );

        const cmd = new CloneBlockCommand({
            store,
            sourceCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            targetCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 1 },
        });

        cmd.execute();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks).toHaveLength(2);
        expect(blocks[0].id).toBe('b1');
        expect(blocks[1].id).not.toBe('b1');
        expect(blocks[1].type).toBe('text');
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('cloned block has different ID but same content', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1', '<p>Hello</p>')])]),
            ])
        );

        const cmd = new CloneBlockCommand({
            store,
            sourceCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            targetCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 1 },
        });

        cmd.execute();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks[1].id).not.toBe(blocks[0].id);
        if (blocks[1].type === 'text') {
            expect(blocks[1].content.html).toBe('<p>Hello</p>');
        }
    });

    it('undo removes the cloned block', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1')])]),
            ])
        );

        const cmd = new CloneBlockCommand({
            store,
            sourceCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            targetCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 1 },
        });

        cmd.execute();
        cmd.undo();

        const blocks = store.template.root.rows[0].columns[0].blocks;
        expect(blocks).toHaveLength(1);
        expect(blocks[0].id).toBe('b1');
    });

    it('does not modify the source block', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1', '<p>Original</p>')])]),
            ])
        );

        const cmd = new CloneBlockCommand({
            store,
            sourceCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            targetCoordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 1 },
        });

        cmd.execute();

        const source = store.template.root.rows[0].columns[0].blocks[0];
        expect(source.id).toBe('b1');
        if (source.type === 'text') {
            expect(source.content.html).toBe('<p>Original</p>');
        }
    });
});
