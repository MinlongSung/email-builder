import { useEditorStore } from "@/stores/useEditorStore";
import { useHistoryStore } from "@/stores/useHistoryStore";

export function Topbar() {
  const viewMode = useEditorStore((state) => state.viewMode);
  const setViewMode = useEditorStore((state) => state.setViewMode);
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);

  return (
    <header className="h-14 bg-slate-800 text-white flex items-center px-4 shrink-0 gap-4">
      <span className="font-semibold tracking-wide">Email Builder</span>

      <div className="flex items-center bg-slate-700 rounded-md p-1 gap-1">
        <button
          onClick={() => setViewMode("desktop")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            viewMode === "desktop"
              ? "bg-white text-slate-800"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            viewMode === "mobile"
              ? "bg-white text-slate-800"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Mobile
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded text-sm text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          ↩
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded text-sm text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          ↪
        </button>
        <button
          className="p-2 rounded text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Timeline"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
