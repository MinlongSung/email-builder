import { vi } from 'vitest';
import type { TemplateEntity, RowEntity, ColumnEntity, BlockEntity } from '$lib/template/types';
import type { TemplateStore } from '$lib/template/contexts/templateContext.svelte';

export function createTextBlock(id: string, html = '<p>text</p>'): BlockEntity {
    return {
        id,
        type: 'text',
        content: { html, json: {} },
    };
}

export function createButtonBlock(id: string, html = '<p>Click</p>'): BlockEntity {
    return {
        id,
        type: 'button',
        content: { html, json: {} },
    };
}

export function createColumn(id: string, blocks: BlockEntity[] = [], width = 100): ColumnEntity {
    return { id, type: 'column', width, blocks };
}

export function createRow(id: string, columns?: ColumnEntity[]): RowEntity {
    return {
        id,
        type: 'row',
        separatorSize: 0,
        isResponsive: true,
        columns: columns ?? [createColumn(`${id}-col-1`)],
    };
}

export function createTemplate(rows: RowEntity[] = []): TemplateEntity {
    return {
        root: {
            id: 'root-1',
            type: 'root',
            width: 600,
            rows,
        },
        config: {}
    };
}

export function createMockStore(template?: TemplateEntity): TemplateStore {
    const t = template ?? createTemplate();
    return {
        template: t,
        mapNodes: vi.fn(),
    } as unknown as TemplateStore;
}
