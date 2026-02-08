import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { RootEntity } from "$lib/template/types";
import { clone } from "$lib/template/utils/clone";
import { Command } from "../../Command";

interface UpdateRootParams {
    store: TemplateStore;
    updates: Partial<RootEntity>;
}

export class UpdateRootCommand extends Command {
    private store: TemplateStore;
    private updates: Partial<RootEntity>;
    private previousRoot: RootEntity | null = null;

    constructor(params: UpdateRootParams) {
        super();
        this.store = params.store;
        this.updates = params.updates;
    }

    execute() {
        const root = this.store.template.root;
        this.previousRoot = clone(root);
        Object.assign(root, this.updates);
    }

    undo() {
        if (!this.previousRoot) return;
        this.store.template.root = this.previousRoot;
    }
}