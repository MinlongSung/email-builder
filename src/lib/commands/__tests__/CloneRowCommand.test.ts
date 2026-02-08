import { describe, it, expect } from 'vitest';
import { CloneRowCommand } from '../structures/rows/CloneRowCommand';
import { createMockStore, createTemplate, createRow, createColumn, createTextBlock } from './helpers';

describe('CloneRowCommand', () => {
    it('clones a row to the target index', () => {
        const store = createMockStore(createTemplate([createRow('r1')]));

        const cmd = new CloneRowCommand({ store, sourceIndex: 0, targetIndex: 1 });
        cmd.execute();

        expect(store.template.root.rows).toHaveLength(2);
        expect(store.template.root.rows[0].id).toBe('r1');
        expect(store.template.root.rows[1].id).not.toBe('r1');
        expect(store.template.root.rows[1].type).toBe('row');
        expect(store.mapNodes).toHaveBeenCalled();
    });

    it('assigns new IDs to the cloned row, columns, and blocks', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [createColumn('c1', [createTextBlock('b1')])]),
            ])
        );

        const cmd = new CloneRowCommand({ store, sourceIndex: 0, targetIndex: 1 });
        cmd.execute();

        const cloned = store.template.root.rows[1];
        expect(cloned.id).not.toBe('r1');
        expect(cloned.columns[0].id).not.toBe('c1');
        expect(cloned.columns[0].blocks[0].id).not.toBe('b1');
    });

    it('preserves the structure of the cloned row', () => {
        const store = createMockStore(
            createTemplate([
                createRow('r1', [
                    createColumn('c1', [createTextBlock('b1'), createTextBlock('b2')]),
                    createColumn('c2', [createTextBlock('b3')]),
                ]),
            ])
        );

        const cmd = new CloneRowCommand({ store, sourceIndex: 0, targetIndex: 1 });
        cmd.execute();

        const cloned = store.template.root.rows[1];
        expect(cloned.columns).toHaveLength(2);
        expect(cloned.columns[0].blocks).toHaveLength(2);
        expect(cloned.columns[1].blocks).toHaveLength(1);
    });

    it('undo removes the cloned row', () => {
        const store = createMockStore(createTemplate([createRow('r1')]));

        const cmd = new CloneRowCommand({ store, sourceIndex: 0, targetIndex: 1 });
        cmd.execute();
        expect(store.template.root.rows).toHaveLength(2);

        cmd.undo();
        expect(store.template.root.rows).toHaveLength(1);
        expect(store.template.root.rows[0].id).toBe('r1');
    });
});
