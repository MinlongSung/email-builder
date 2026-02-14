import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateTemplateConfigCommand } from '../config/UpdateTemplateConfigCommand';
import { TemplateStore } from '$lib/template/contexts/templateContext.svelte';
import type { TemplateEntity } from '$lib/template/types';

describe('UpdateTemplateConfigCommand', () => {
    let store: TemplateStore;
    let template: TemplateEntity;

    beforeEach(() => {
        template = {
            root: {
                id: 'root',
                type: 'root',
                width: 600,
                rows: []
            },
            config: {
                paragraph: {
                    color: '#000000',
                    fontSize: '14px'
                },
                h1: {
                    color: '#333333',
                    fontSize: '24px'
                },
                link: {
                    color: '#0000ff',
                    isUnderlined: true
                }
            }
        };

        store = new TemplateStore(template);
    });

    it('should update paragraph config', () => {
        const command = new UpdateTemplateConfigCommand({
            store,
            updates: {
                paragraph: {
                    color: '#ff0000',
                    fontSize: '16px'
                }
            }
        });

        command.execute();

        expect(store.template.config.paragraph?.color).toBe('#ff0000');
        expect(store.template.config.paragraph?.fontSize).toBe('16px');
    });

    it('should merge partial updates without overwriting other properties', () => {
        const command = new UpdateTemplateConfigCommand({
            store,
            updates: {
                paragraph: {
                    color: '#ff0000'
                }
            }
        });

        command.execute();

        expect(store.template.config.paragraph?.color).toBe('#ff0000');
        expect(store.template.config.paragraph?.fontSize).toBe('14px'); // No modificado
    });

    it('should update heading level config', () => {
        const command = new UpdateTemplateConfigCommand({
            store,
            updates: {
                h2: {
                    color: '#666666',
                    fontSize: '20px'
                }
            }
        });

        command.execute();

        expect(store.template.config.h2?.color).toBe('#666666');
        expect(store.template.config.h1?.color).toBe('#333333'); // No modificado
    });

    it('should update multiple config sections at once', () => {
        const command = new UpdateTemplateConfigCommand({
            store,
            updates: {
                paragraph: {
                    color: '#ff0000'
                },
                link: {
                    color: '#00ff00'
                }
            }
        });

        command.execute();

        expect(store.template.config.paragraph?.color).toBe('#ff0000');
        expect(store.template.config.link?.color).toBe('#00ff00');
    });

    it('should support undo', () => {
        const originalColor = store.template.config.paragraph?.color;

        const command = new UpdateTemplateConfigCommand({
            store,
            updates: {
                paragraph: {
                    color: '#ff0000'
                }
            }
        });

        command.execute();
        expect(store.template.config.paragraph?.color).toBe('#ff0000');

        command.undo();
        expect(store.template.config.paragraph?.color).toBe(originalColor);
    });

    it('should preserve all original config when undoing', () => {
        const command = new UpdateTemplateConfigCommand({
            store,
            updates: {
                paragraph: {
                    color: '#ff0000',
                    fontSize: '20px'
                },
                h3: {
                    color: '#999999'
                }
            }
        });

        command.execute();
        command.undo();

        expect(store.template.config).toEqual(template.config);
    });
});
