import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { TemplateConfig } from "$lib/template/types";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../Command";

interface UpdateTemplateConfigParams {
    store: TemplateStore;
    updates: Partial<TemplateConfig>;
}

export class UpdateTemplateConfigCommand extends Command {
    private store: TemplateStore;
    private updates: Partial<TemplateConfig>;
    private previousConfig: Partial<TemplateConfig> | null = null;

    constructor(params: UpdateTemplateConfigParams) {
        super();
        this.store = params.store;
        this.updates = params.updates;
    }

    execute() {
        this.previousConfig = clone(this.store.template.config);

        this.store.template.config = this.mergeConfig(
            this.store.template.config,
            this.updates
        );
    }

    undo() {
        if (!this.previousConfig) return;
        this.store.template.config = this.previousConfig;
    }

    private mergeConfig(
        current: Partial<TemplateConfig>,
        updates: Partial<TemplateConfig>
    ): Partial<TemplateConfig> {
        const merged = { ...current };

        if (updates.heading) {
            merged.heading = {
                level: {
                    ...current.heading?.level,
                    ...updates.heading.level
                }
            };
        }

        if (updates.paragraph) {
            merged.paragraph = {
                ...current.paragraph,
                ...updates.paragraph
            };
        }

        if (updates.link) {
            merged.link = {
                ...current.link,
                ...updates.link
            };
        }

        if (updates.button) {
            merged.button = {
                ...current.button,
                ...updates.button
            };
        }

        return merged;
    }
}
