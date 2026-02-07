import { getContext, setContext } from "svelte";

export type ViewMode = "desktop" | "mobile";

class UIStore {
    private _selectedId = $state<string | null>(null);
    private _hoveredId = $state<string | null>(null);
    private _viewMode = $state<ViewMode>("desktop");

    get selectedId(): string | null {
        return this._selectedId;
    }

    set selectedId(id: string | null) {
        this._selectedId = id;
    }

    get hoveredId(): string | null {
        return this._hoveredId;
    }

    set hoveredId(id: string | null) {
        this._hoveredId = id;
    }

    get viewMode(): ViewMode {
        return this._viewMode;
    }

    set viewMode(viewMode: ViewMode) {
        this._viewMode = viewMode;
    }
}

const CONTEXT_KEY = Symbol("ui");

export function setUIContext() {
    const uiStore = new UIStore();
    setContext(CONTEXT_KEY, uiStore);
}

export function getUIContext() {
    return getContext<UIStore>(CONTEXT_KEY);
}