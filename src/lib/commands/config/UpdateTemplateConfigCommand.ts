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

        const keys: (keyof TemplateConfig)[] = ['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'link', 'button'];

        keys.forEach(key => {
            if (updates[key]) {
                merged[key] = {
                    ...current[key],
                    ...updates[key]
                };
            }
        });

        return merged;
    }
}
