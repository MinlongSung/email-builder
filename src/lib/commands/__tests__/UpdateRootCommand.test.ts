import { describe, it, expect } from 'vitest';
import { UpdateRootCommand } from '../structures/root/UpdateRootCommand';
import { createMockStore, createTemplate, createRow } from './helpers';

describe('UpdateRootCommand', () => {
	it('updates root width', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));

		const cmd = new UpdateRootCommand({
			store,
			updates: { width: 800 }
		});

		cmd.execute();

		expect(store.template.root.width).toBe(800);
	});

	it('updates root style', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));

		const cmd = new UpdateRootCommand({
			store,
			updates: { style: { 'background-color': '#f0f0f0', padding: '20px' } }
		});

		cmd.execute();

		expect(store.template.root.style).toEqual({ 'background-color': '#f0f0f0', padding: '20px' });
	});

	it('applies multiple partial updates', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));

		const cmd = new UpdateRootCommand({
			store,
			updates: {
				width: 700,
				style: { margin: '10px' }
			}
		});

		cmd.execute();

		expect(store.template.root.width).toBe(700);
		expect(store.template.root.style).toEqual({ margin: '10px' });
	});

	it('undo restores the previous root state', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));
		const originalWidth = store.template.root.width;

		const cmd = new UpdateRootCommand({
			store,
			updates: { width: 800 }
		});

		cmd.execute();
		expect(store.template.root.width).toBe(800);

		cmd.undo();
		expect(store.template.root.width).toBe(originalWidth);
	});

	it('undo restores all properties including style', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));
		store.template.root.style = { 'background-color': 'white' };
		const originalWidth = store.template.root.width;

		const cmd = new UpdateRootCommand({
			store,
			updates: {
				width: 900,
				style: { 'background-color': 'black', color: 'white' }
			}
		});

		cmd.execute();
		expect(store.template.root.width).toBe(900);
		expect(store.template.root.style).toEqual({ 'background-color': 'black', color: 'white' });

		cmd.undo();
		expect(store.template.root.width).toBe(originalWidth);
		expect(store.template.root.style).toEqual({ 'background-color': 'white' });
	});

	it('preserves unchanged properties during update', () => {
		const store = createMockStore(createTemplate([createRow('r1'), createRow('r2')]));
		const originalId = store.template.root.id;
		const originalRows = store.template.root.rows;

		const cmd = new UpdateRootCommand({
			store,
			updates: { width: 750 }
		});

		cmd.execute();

		expect(store.template.root.id).toBe(originalId);
		expect(store.template.root.type).toBe('root');
		expect(store.template.root.rows).toBe(originalRows);
		expect(store.template.root.rows).toHaveLength(2);
	});

	it('undo does nothing if previousRoot is null', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));

		const cmd = new UpdateRootCommand({
			store,
			updates: { width: 800 }
		});

		// Call undo before execute
		cmd.undo();

		// Root should still have original value
		expect(store.template.root.width).toBe(600);
	});

	it('handles empty updates object', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));
		const originalWidth = store.template.root.width;

		const cmd = new UpdateRootCommand({
			store,
			updates: {}
		});

		cmd.execute();

		expect(store.template.root.width).toBe(originalWidth);
	});

	it('updates style properties using Object.assign', () => {
		const store = createMockStore(createTemplate([createRow('r1')]));
		store.template.root.style = { padding: '10px', margin: '5px' };

		const cmd = new UpdateRootCommand({
			store,
			updates: { style: { padding: '20px', color: 'red' } }
		});

		cmd.execute();

		// Object.assign replaces the entire style object
		expect(store.template.root.style).toEqual({ padding: '20px', color: 'red' });
	});
});
