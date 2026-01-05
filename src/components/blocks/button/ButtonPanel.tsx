import { useState, useEffect } from "react";
import type { ButtonBlockEntity } from "@/entities/template";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { UpdateBlockCommand } from "@/commands/blocks/UpdateBlockCommand";
import { historyService } from "@/history/services/historyService";
import { generateId } from "@/utils/generateId";

const FONT_FAMILIES = [
  { value: "", label: "Default" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "'Trebuchet MS', sans-serif", label: "Trebuchet MS" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Palatino, serif", label: "Palatino" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Nunito, sans-serif", label: "Nunito" },
  { value: "Raleway, sans-serif", label: "Raleway" },
];

export const ButtonPanel = ({ block }: { block: ButtonBlockEntity }) => {
  const getTemplate = useCanvasStore((store) => store.getTemplate);
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const getBlockCoordinates = useCanvasStore(
    (store) => store.getBlockCoordinates
  );

  // Local state for inputs
  const [localStyles, setLocalStyles] = useState<React.CSSProperties>(
    block.style || {}
  );

  // Sync local state when block changes (undo/redo)
  useEffect(() => {
    const handleUpdate = () => {
      setLocalStyles(block.style || {});
    };
    handleUpdate();
  }, [block.style]);

  // Debounced update handler
  const handleStyleUpdate = useDebouncedCallback(
    (updates: React.CSSProperties) => {
      const blockCoordinates = getBlockCoordinates(block.id);
      if (blockCoordinates === null) return;

      const command = new UpdateBlockCommand({
        ...blockCoordinates,
        getTemplate,
        setTemplate,
        updates: {
          style: {
            ...block.style,
            ...updates,
          },
        },
      });

      historyService.executeCommand(command, {
        id: generateId(),
        type: "block.update",
        timestamp: Date.now(),
      });
    },
    300
  );

  const handleChange = (property: string, value: string) => {
    const newStyles = { ...localStyles, [property]: value };
    setLocalStyles(newStyles);
    handleStyleUpdate({ [property]: value });
  };

  function toggleStyle<K extends keyof React.CSSProperties>(
    property: K,
    value: NonNullable<React.CSSProperties[K]>
  ) {
    const newStyles = { ...localStyles };

    if (newStyles[property] === value) {
      delete newStyles[property];
      handleStyleUpdate({ [property]: undefined });
    } else {
      newStyles[property] = value;
      handleStyleUpdate({ [property]: value });
    }

    setLocalStyles(newStyles);
  }

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
        Button Properties
      </h3>

      {/* Prosemirror Toolbar for text formatting */}
      <div>
        <label
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "8px",
            display: "block",
          }}
        >
          Text Formatting
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "5" }}>
          {/* Formato de texto básico, bold e italic toggle */}
          {/* Bold */}
          <button
            onClick={() => toggleStyle("fontWeight", "bold")}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background:
                localStyles.fontWeight === "bold" ? "#e5e7eb" : "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            B
          </button>

          {/* Italic */}
          <button
            onClick={() => toggleStyle("fontStyle", "italic")}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background:
                localStyles.fontStyle === "italic" ? "#e5e7eb" : "#ffffff",
              fontStyle: "italic",
              cursor: "pointer",
            }}
          >
            I
          </button>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Background Color
        </label>
        <input
          type="color"
          value={(localStyles.backgroundColor as string) || "#3498db"}
          onChange={(e) => handleChange("backgroundColor", e.target.value)}
          style={{ width: "100%", height: "32px", cursor: "pointer" }}
        />
      </div>

      {/* Text Color */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Text Color
        </label>
        <input
          type="color"
          value={(localStyles.color as string) || "#ffffff"}
          onChange={(e) => handleChange("color", e.target.value)}
          style={{ width: "100%", height: "32px", cursor: "pointer" }}
        />
      </div>

      {/* Padding */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Padding (e.g., 12px 24px or 10px 20px 10px 20px)
        </label>
        <input
          type="text"
          value={(localStyles.padding as string) || "12px 24px"}
          onChange={(e) => handleChange("padding", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
          placeholder="e.g., 12px 24px"
        />
      </div>

      {/* Border Radius */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Border Radius (e.g., 4px or 8px 8px 0 0)
        </label>
        <input
          type="text"
          value={(localStyles.borderRadius as string) || "4px"}
          onChange={(e) => handleChange("borderRadius", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
          placeholder="e.g., 4px"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Font Weight
        </label>
        <select
          value={(localStyles.fontWeight as string) || "600"}
          onChange={(e) => handleChange("fontWeight", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi Bold</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Font Size (e.g., 16px, 1em)
        </label>
        <input
          type="text"
          value={(localStyles.fontSize as string) || "16px"}
          onChange={(e) => handleChange("fontSize", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
          placeholder="e.g., 16px"
        />
      </div>

      <div>
        <label
          style={{
            fontSize: "12px",
            display: "block",
            marginBottom: "2px",
          }}
        >
          Font Family
        </label>
        <select
          value={localStyles.fontFamily}
          onChange={(e) => handleChange("fontFamily", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Line Height */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Line Height (e.g., 1.5, 24px)
        </label>
        <input
          type="text"
          value={(localStyles.lineHeight as string) || "1.2"}
          onChange={(e) => handleChange("lineHeight", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
          placeholder="e.g., 1.2"
        />
      </div>

      {/* Text Decoration */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Text Decoration
        </label>
        <select
          value={(localStyles.textDecoration as string) || "none"}
          onChange={(e) => handleChange("textDecoration", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Line Through</option>
        </select>
      </div>

      {/* Width */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Width (e.g., auto, 100%, 200px)
        </label>
        <input
          type="text"
          value={(localStyles.width as string) || "auto"}
          onChange={(e) => handleChange("width", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
          placeholder="e.g., auto"
        />
      </div>

      {/* Border */}
      <div>
        <label
          style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
        >
          Border (e.g., 2px solid #000000)
        </label>
        <input
          type="text"
          value={(localStyles.border as string) || "none"}
          onChange={(e) => handleChange("border", e.target.value)}
          style={{ width: "100%", padding: "4px 8px" }}
          placeholder="e.g., 2px solid #000000"
        />
      </div>
    </div>
  );
};
