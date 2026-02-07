import { describe, it, expect } from 'vitest';
import { UpdateBlockCommand } from '../blocks/UpdateBlockCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('UpdateBlockCommand', () => {
    it('applies partial updates to the block', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1', '<p>Old</p>')])]),
            ])
        );

        const cmd = new UpdateBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            updates: { content: { html: '<p>New</p>', json: {} } },
        });

        cmd.execute();

        const block = store.template.root.rows[0].columns[0].blocks[0];
        if (block.type === 'text') {
            expect(block.content.html).toBe('<p>New</p>');
        }
    });

    it('applies style updates', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1')])]),
            ])
        );

        const cmd = new UpdateBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            updates: { style: { color: 'red', 'font-size': '16px' } },
        });

        cmd.execute();

        const block = store.template.root.rows[0].columns[0].blocks[0];
        expect(block.style).toEqual({ color: 'red', 'font-size': '16px' });
    });

    it('undo restores the previous block state', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1', '<p>Original</p>')])]),
            ])
        );

        const cmd = new UpdateBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            updates: { content: { html: '<p>Changed</p>', json: {} } },
        });

        cmd.execute();
        cmd.undo();

        const block = store.template.root.rows[0].columns[0].blocks[0];
        if (block.type === 'text') {
            expect(block.content.html).toBe('<p>Original</p>');
        }
    });

    it('preserves unchanged properties during update', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1')])]),
            ])
        );

        const cmd = new UpdateBlockCommand({
            store,
            coordinates: { rowIndex: 0, columnIndex: 0, blockIndex: 0 },
            updates: { style: { padding: '10px' } },
        });

        cmd.execute();

        const block = store.template.root.rows[0].columns[0].blocks[0];
        expect(block.id).toBe('b1');
        expect(block.type).toBe('text');
    });
});
