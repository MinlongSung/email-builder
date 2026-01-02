import { useState } from "react";
import { type BackgroundImageConfig } from "./types";

interface BackgroundImagePreviewProps {
  config: BackgroundImageConfig;
  onConfigChange: (config: BackgroundImageConfig) => void;
  onDelete: () => void;
  onChangeImage: () => void;
  onLoadFromUrl: (
    url: string,
    dimensions: { width: number; height: number }
  ) => void;
}

type PositionValue =
  | "top"
  | "center"
  | "bottom"
  | "left"
  | "right"
  | { value: number; unit: "px" | "%" };

export const BackgroundImagePreview = ({
  config,
  onConfigChange,
  onDelete,
  onChangeImage,
  onLoadFromUrl,
}: BackgroundImagePreviewProps) => {
  const [urlInput, setUrlInput] = useState("");

  const handleRepeatChange = (repeat: boolean) => {
    onConfigChange({ ...config, repeat });
  };

  const handlePositionChange = (
    axis: "vertical" | "horizontal",
    newValue: PositionValue
  ) => {
    onConfigChange({
      ...config,
      position: {
        ...config.position,
        [axis]: newValue,
      },
    });
  };

  const handleSizeTypeChange = (
    sizeType: "contain" | "auto" | "cover" | "custom"
  ) => {
    if (sizeType === "custom") {
      onConfigChange({
        ...config,
        size: {
          width: { value: 100, unit: "px" },
          height: { value: 100, unit: "px" },
        },
      });
    } else if (sizeType === "cover") {
      // Si es cover, limpiar position porque cover nunca se posiciona
      onConfigChange({
        ...config,
        position: undefined,
        size: {
          width: sizeType,
          height: "auto",
        },
      });
    } else {
      onConfigChange({
        ...config,
        size: {
          width: sizeType,
          height: "auto",
        },
      });
    }
  };

  const handleCustomSizeChange = (
    axis: "width" | "height",
    value: number,
    unit: "px" | "%"
  ) => {
    const currentSize = config.size || { width: "auto", height: "auto" };
    onConfigChange({
      ...config,
      size: {
        ...currentSize,
        [axis]: { value, unit },
      },
    });
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    const img = new Image();
    img.onload = () => {
      onLoadFromUrl(urlInput, { width: img.width, height: img.height });
      setUrlInput("");
    };
    img.onerror = () => {
      alert("Failed to load image from URL");
    };
    img.src = urlInput;
  };

  const verticalPos = config.position?.vertical ?? "top";
  const horizontalPos = config.position?.horizontal ?? "left";
  const widthSize = config.size?.width ?? "auto";
  const heightSize = config.size?.height ?? "auto";

  const isVerticalCustom = typeof verticalPos === "object";
  const isHorizontalCustom = typeof horizontalPos === "object";
  const isWidthCustom = typeof widthSize === "object";
  const isHeightCustom = typeof heightSize === "object";

  // Determinar el tipo de size seleccionado
  let currentSizeType: "contain" | "auto" | "cover" | "custom" = "auto";
  if (widthSize === "contain" || heightSize === "contain") {
    currentSizeType = "contain";
  } else if (widthSize === "cover" || heightSize === "cover") {
    currentSizeType = "cover";
  } else if (isWidthCustom || isHeightCustom) {
    currentSizeType = "custom";
  } else if (widthSize === "auto" && heightSize === "auto") {
    currentSizeType = "auto";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      {/* Preview Image */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <img
          src={config.url}
          alt="Background preview"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: "150px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Image Info */}
      <div style={{ fontSize: "12px", color: "#666" }}>
        {config.fileName && (
          <div>
            <strong>Name:</strong> {config.fileName}
          </div>
        )}
        {config.fileSize !== undefined && config.fileSize > 0 && (
          <div>
            <strong>Size:</strong> {(config.fileSize / 1024).toFixed(2)} KB
          </div>
        )}
        {config.dimensions && (
          <div>
            <strong>Dimensions:</strong> {config.dimensions.width} x{" "}
            {config.dimensions.height}px
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onChangeImage}
          style={{
            flex: 1,
            padding: "6px 12px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Change
        </button>
        <button
          onClick={onDelete}
          style={{
            flex: 1,
            padding: "6px 12px",
            cursor: "pointer",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Delete
        </button>
      </div>

      {/* URL Input */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          Load from URL:
        </label>
        <div style={{ display: "flex", gap: "4px" }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder="https://example.com/image.jpg"
            style={{
              flex: 1,
              padding: "6px",
              fontSize: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleUrlSubmit}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Load
          </button>
        </div>
      </div>

      {/* Repeat Checkbox */}
      <div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={config.repeat ?? false}
            onChange={(e) => handleRepeatChange(e.target.checked)}
          />
          <span style={{ fontWeight: "bold" }}>Repeat</span>
        </label>
      </div>

      {/* Position Controls */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          Vertical Align:
        </label>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {(["top", "center", "bottom", "custom"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => {
                if (pos === "custom") {
                  handlePositionChange("vertical", { value: 0, unit: "px" });
                } else {
                  handlePositionChange("vertical", pos);
                }
              }}
              disabled={currentSizeType === "cover"}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  currentSizeType === "cover"
                    ? "1px solid #ccc"
                    : (
                        pos === "custom"
                          ? isVerticalCustom
                          : verticalPos === pos
                      )
                    ? "2px solid blue"
                    : "1px solid #ccc",
                borderRadius: "4px",
                cursor: currentSizeType === "cover" ? "not-allowed" : "pointer",
                opacity: currentSizeType === "cover" ? 0.5 : 1,
                backgroundColor:
                  currentSizeType === "cover"
                    ? "white"
                    : (
                        pos === "custom"
                          ? isVerticalCustom
                          : verticalPos === pos
                      )
                    ? "#e3f2fd"
                    : "white",
              }}
            >
              {pos}
            </button>
          ))}
        </div>
        {isVerticalCustom && typeof verticalPos === "object" && (
          <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
            <input
              type="number"
              value={verticalPos.value}
              onChange={(e) =>
                handlePositionChange("vertical", {
                  value: Number(e.target.value),
                  unit: verticalPos.unit,
                })
              }
              style={{ width: "70px", padding: "4px", fontSize: "12px" }}
            />
            <button
              onClick={() =>
                handlePositionChange("vertical", {
                  value: verticalPos.value,
                  unit: "px",
                })
              }
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  verticalPos.unit === "px"
                    ? "2px solid blue"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              px
            </button>
            <button
              onClick={() =>
                handlePositionChange("vertical", {
                  value: verticalPos.value,
                  unit: "%",
                })
              }
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  verticalPos.unit === "%"
                    ? "2px solid blue"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              %
            </button>
          </div>
        )}
      </div>

      <div>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          Horizontal Align:
        </label>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {(["left", "center", "right", "custom"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => {
                if (pos === "custom") {
                  handlePositionChange("horizontal", { value: 0, unit: "px" });
                } else {
                  handlePositionChange("horizontal", pos);
                }
              }}
              disabled={currentSizeType === "cover"}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  currentSizeType === "cover"
                    ? "1px solid #ccc"
                    : (
                        pos === "custom"
                          ? isHorizontalCustom
                          : horizontalPos === pos
                      )
                    ? "2px solid blue"
                    : "1px solid #ccc",
                borderRadius: "4px",
                cursor: currentSizeType === "cover" ? "not-allowed" : "pointer",
                opacity: currentSizeType === "cover" ? 0.5 : 1,
                backgroundColor:
                  currentSizeType === "cover"
                    ? "white"
                    : (
                        pos === "custom"
                          ? isHorizontalCustom
                          : horizontalPos === pos
                      )
                    ? "#e3f2fd"
                    : "white",
              }}
            >
              {pos}
            </button>
          ))}
        </div>
        {isHorizontalCustom && typeof horizontalPos === "object" && (
          <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
            <input
              type="number"
              value={horizontalPos.value}
              onChange={(e) =>
                handlePositionChange("horizontal", {
                  value: Number(e.target.value),
                  unit: horizontalPos.unit,
                })
              }
              style={{ width: "70px", padding: "4px", fontSize: "12px" }}
            />
            <button
              onClick={() =>
                handlePositionChange("horizontal", {
                  value: horizontalPos.value,
                  unit: "px",
                })
              }
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  horizontalPos.unit === "px"
                    ? "2px solid blue"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              px
            </button>
            <button
              onClick={() =>
                handlePositionChange("horizontal", {
                  value: horizontalPos.value,
                  unit: "%",
                })
              }
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  horizontalPos.unit === "%"
                    ? "2px solid blue"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              %
            </button>
          </div>
        )}
      </div>

      {/* Size Controls - Un solo label */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          Size:
        </label>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {(["contain", "auto", "cover", "custom"] as const).map((sizeType) => (
            <button
              key={sizeType}
              onClick={() => handleSizeTypeChange(sizeType)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border:
                  currentSizeType === sizeType
                    ? "2px solid blue"
                    : "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor:
                  currentSizeType === sizeType ? "#e3f2fd" : "white",
              }}
            >
              {sizeType}
            </button>
          ))}
        </div>

        {/* Custom Size Inputs - Width y Height separados */}
        {currentSizeType === "custom" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "8px",
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
            }}
          >
            {/* Width */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Width:
              </label>
              <div style={{ display: "flex", gap: "4px" }}>
                <input
                  type="number"
                  value={
                    isWidthCustom && typeof widthSize === "object"
                      ? widthSize.value
                      : 100
                  }
                  onChange={(e) => {
                    const unit = (
                      isWidthCustom && typeof widthSize === "object"
                        ? widthSize.unit
                        : "px"
                    ) as "px" | "%";
                    handleCustomSizeChange(
                      "width",
                      Number(e.target.value),
                      unit
                    );
                  }}
                  style={{ width: "70px", padding: "4px", fontSize: "12px" }}
                />
                <button
                  onClick={() => {
                    const value =
                      isWidthCustom && typeof widthSize === "object"
                        ? widthSize.value
                        : 100;
                    handleCustomSizeChange("width", value, "px");
                  }}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    border:
                      isWidthCustom &&
                      typeof widthSize === "object" &&
                      widthSize.unit === "px"
                        ? "2px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  px
                </button>
                <button
                  onClick={() => {
                    const value =
                      isWidthCustom && typeof widthSize === "object"
                        ? widthSize.value
                        : 100;
                    handleCustomSizeChange("width", value, "%");
                  }}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    border:
                      isWidthCustom &&
                      typeof widthSize === "object" &&
                      widthSize.unit === "%"
                        ? "2px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  %
                </button>
              </div>
            </div>

            {/* Height */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Height:
              </label>
              <div style={{ display: "flex", gap: "4px" }}>
                <input
                  type="number"
                  value={
                    isHeightCustom && typeof heightSize === "object"
                      ? heightSize.value
                      : 100
                  }
                  onChange={(e) => {
                    const unit = (
                      isHeightCustom && typeof heightSize === "object"
                        ? heightSize.unit
                        : "px"
                    ) as "px" | "%";
                    handleCustomSizeChange(
                      "height",
                      Number(e.target.value),
                      unit
                    );
                  }}
                  style={{ width: "70px", padding: "4px", fontSize: "12px" }}
                />
                <button
                  onClick={() => {
                    const value =
                      isHeightCustom && typeof heightSize === "object"
                        ? heightSize.value
                        : 100;
                    handleCustomSizeChange("height", value, "px");
                  }}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    border:
                      isHeightCustom &&
                      typeof heightSize === "object" &&
                      heightSize.unit === "px"
                        ? "2px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  px
                </button>
                <button
                  onClick={() => {
                    const value =
                      isHeightCustom && typeof heightSize === "object"
                        ? heightSize.value
                        : 100;
                    handleCustomSizeChange("height", value, "%");
                  }}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    border:
                      isHeightCustom &&
                      typeof heightSize === "object" &&
                      heightSize.unit === "%"
                        ? "2px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  %
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
