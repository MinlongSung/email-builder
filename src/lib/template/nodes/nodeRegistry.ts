import type { Component } from 'svelte';
import type { NodeType } from '$lib/template/types';

import RootNode from './structures/root/Root.svelte';
import RowNode from './structures/row/Row.svelte';
import ColumnNode from './structures/column/Column.svelte';
import TextBlock from './blocks/text/TextBlock.svelte';
import ButtonBlock from './blocks/button/ButtonBlock.svelte';
import TextCard from './blocks/text/TextCard.svelte';
import ButtonCard from './blocks/button/ButtonCard.svelte';
import RowCard from './structures/row/RowCard.svelte';
import TextPanel from './blocks/text/TextPanel.svelte';
import ButtonPanel from './blocks/button/ButtonPanel.svelte';

export type RenderFormat = 'canvas' | 'card' | 'sidebar' | 'propertiesPanel';

// Cada nodo puede tener múltiples variantes de renderizado
export type NodeRenderer = Partial<Record<RenderFormat, Component<any>>>;

class NodeRegistry {
	private registry: Map<NodeType, NodeRenderer> = new Map();

	/**
	 * Registra un tipo de nodo con sus variantes de renderizado
	 */
	register(type: NodeType, renderer: NodeRenderer): void {
		if (this.registry.has(type)) {
			console.warn(`Node type "${type}" is already registered. Overwriting.`);
		}
		this.registry.set(type, renderer);
	}

	/**
	 * Obtiene el componente para un tipo de nodo y formato específico
	 */
	getComponent(type: NodeType, format: RenderFormat = 'canvas'): Component<any> | null {
		const entry = this.registry.get(type);
		if (!entry) {
			console.error(`Unknown node type: ${type}`);
			return null;
		}

		const component = entry[format];
		if (!component) {
			console.warn(`No renderer for ${type} in format: ${format}`);
			return null;
		}

		return component;
	}
}

// Instancia única del registro
export const nodeRegistry = new NodeRegistry();

// Registrar todos los nodos con sus variantes
nodeRegistry.register('root', {
	canvas: RootNode,
	// card: RootCard, // Agregar cuando exista
	// propertiesPanel: RootPanel,
});

nodeRegistry.register('row', {
	canvas: RowNode,
	card: RowCard,
	// propertiesPanel: RowPanel,
});

nodeRegistry.register('column', {
	canvas: ColumnNode,
	// card: ColumnCard,
	// propertiesPanel: ColumnPanel,
});

nodeRegistry.register('text', {
	canvas: TextBlock,
	card: TextCard,
	propertiesPanel: TextPanel,
});

nodeRegistry.register('button', {
	canvas: ButtonBlock,
	card: ButtonCard,
	propertiesPanel: ButtonPanel,
});
