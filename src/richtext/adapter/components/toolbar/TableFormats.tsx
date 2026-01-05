import type { Editor } from "@/richtext/core/Editor";
import type { ProsemirrorState } from "./ProsemirrorToolbar";
import { createPortal } from "react-dom";

// TODO: MENU EN SCROLL NO SE QUEDA EN EL SITIO,
// SI PONGO MENU EN ZONA IZQ, SE CORTA.... mantener dentro del viewport
export const TableFormats = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <button
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
        }
        title="Insert Table"
      >
        TABLE
      </button>

      <TableMenu editor={editor} editorState={editorState} />
    </div>
  );
};

export const TableMenu = ({
  editor,
  editorState,
}: {
  editor: Editor;
  editorState: ProsemirrorState;
}) => {
  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editor.commands.setCellAttribute("backgroundColor", e.target.value);
  };

  const border = editorState.table.cellAttrs?.border || {
    width: "1px",
    style: "solid",
    color: "#000000",
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "1";
    editor.commands.setCellAttribute("border", {
      ...border,
      width: value.includes("px") ? value : `${value}px`,
    });
  };

  const handleBorderStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor.commands.setCellAttribute("border", {
      ...border,
      style: e.target.value,
    });
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.commands.setCellAttribute("border", {
      ...border,
      color: e.target.value,
    });
  };

  const incrementBorderWidth = () => {
    const currentWidth = parseInt(border.width) || 1;
    editor.commands.setCellAttribute("border", {
      ...border,
      width: `${currentWidth + 1}px`,
    });
  };

  const decrementBorderWidth = () => {
    const currentWidth = parseInt(border.width) || 1;
    if (currentWidth > 1) {
      editor.commands.setCellAttribute("border", {
        ...border,
        width: `${currentWidth - 1}px`,
      });
    }
  };

  // Si no hay tabla activa, no mostrar el menú
  if (!editorState.table.rect) {
    return null;
  }

  const backgroundColor =
    editorState.table.cellAttrs?.backgroundColor || "#ffffff";
  const borderWidth = parseInt(border.width) || 1;
  const borderStyle = border.style;
  const borderColor = border.color;
  const tableRect = editorState.table.rect;
  const centerX = tableRect ? tableRect.left + tableRect.width / 2 : 0;

  return createPortal(
    <div
      data-no-dismiss
      style={{
        position: "absolute",
        top: (tableRect?.top || 0) - 10,
        left: centerX,
        transform: "translate(-50%, -100%)",
        border: "1px solid #ccc",
        backgroundColor: "white",
        padding: "8px",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        gap: "8px",
        alignItems: "center",
        zIndex: 1000,
        fontSize: "12px",
        flexWrap: "wrap",
      }}
    >
      {/* Row/Column controls */}
      <button onClick={() => editor.commands.addRowBefore()}>+ Row ↑</button>
      <button onClick={() => editor.commands.addRowAfter()}>+ Row ↓</button>
      <button onClick={() => editor.commands.addColumnBefore()}>+ Col ←</button>
      <button onClick={() => editor.commands.addColumnAfter()}>+ Col →</button>

      <button onClick={() => editor.commands.deleteRow()}>- Row</button>
      <button onClick={() => editor.commands.deleteColumn()}>- Col</button>

      {editorState.table.cellAttrs && (
        <>
          <button
            onClick={() => editor.commands.mergeCells()}
            disabled={!editorState.table.canMergeCells}
          >
            ⬌ Merge
          </button>
          <button
            onClick={() => editor.commands.splitCell()}
            disabled={!editorState.table.canSplitCell}
          >
            ⬍ Split
          </button>

          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            title="Background color"
          />

          <button onClick={decrementBorderWidth}>-</button>
          <input
            type="number"
            value={borderWidth}
            onChange={handleBorderWidthChange}
            style={{ width: "50px" }}
            min="0"
          />
          <button onClick={incrementBorderWidth}>+</button>

          <select value={borderStyle} onChange={handleBorderStyleChange}>
            <option value="solid">—</option>
            <option value="dashed">- -</option>
            <option value="dotted">···</option>
            <option value="double">═</option>
            <option value="none">None</option>
          </select>

          <input
            type="color"
            value={borderColor}
            onChange={handleBorderColorChange}
            title="Border color"
          />
        </>
      )}

      <button
        onClick={() => editor.commands.deleteTable()}
        style={{ color: "red" }}
      >
        🗑
      </button>
    </div>,
    document.body
  );
};
