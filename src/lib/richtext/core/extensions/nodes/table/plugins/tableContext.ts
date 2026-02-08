import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorState } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { findTable, type FindNodeResult } from "prosemirror-tables";

export interface TableContextState {
  tableInfo: FindNodeResult | null;
  tableElement: HTMLElement | null;
}

export const tableContextKey = new PluginKey<TableContextState>("tableContext");

export function tableContextPlugin() {
  return new Plugin<TableContextState>({
    key: tableContextKey,

    state: {
      init(_, state) {
        const { $from } = state.selection;
        return { tableInfo: findTable($from), tableElement: null };
      },

      apply(tr, value, _oldState, newState) {
        if (!tr.docChanged && !tr.selectionSet) {
          return value;
        }
        
        const { $from } = newState.selection;
        return { tableInfo: findTable($from), tableElement: null };
      },
    },

    view(editorView: EditorView) {
      const updateTableElement = () => {
        const state = tableContextKey.getState(editorView.state);
        if (!state?.tableInfo) return;

        const tableDOM = editorView.nodeDOM(state.tableInfo.pos);
        const tableElement = tableDOM instanceof HTMLElement &&
          tableDOM.tagName === 'TABLE'
          ? tableDOM
          : tableDOM instanceof HTMLElement
            ? tableDOM.querySelector('table')
            : null;

        state.tableElement = tableElement
      };

      return {
        update(view: EditorView, prevState: EditorState) {
          if (view.state.selection !== prevState.selection || view.state.doc !== prevState.doc) {
            updateTableElement();
          }
        },
      };
    }
  });
}