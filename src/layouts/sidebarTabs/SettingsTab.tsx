import { useState, useEffect } from "react";
import { BackgroundImageModal } from "@/components/backgroundImage/BackgroundImageModal";
import { BackgroundImagePreview } from "@/components/backgroundImage/BackgroundImagePreview";
import { type ImageFile } from "@/components/backgroundImage/ImageList";
import {
  type BackgroundImageConfig,
  configToCSS,
  cssToConfig,
} from "@/components/backgroundImage/types";
import { useCanvasStore } from "@/stores/useCanvasStore";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { TemplateSettings } from "@/entities/template";
import { historyService } from "@/history/services/historyService";
import { generateId } from "@/utils/generateId";
import { UpdateTemplateStylesCommand } from "@/commands/template/UpdateTemplateStylesCommand";
import { getOrCreateGlobalEditor } from "@/richtext/adapter/utils/globalEditor";
import { BatchCommand } from "@/commands/BatchCommands";
import { applyGlobalStyles } from "@/richtext/adapter/utils/applyGlobalStyles";

import {
  isHeadingLevel,
  isParagraph,
} from "@/richtext/core/extensions/utils/textNodeChecks";
import { isLink } from "@/richtext/core/extensions/marks/link/utils/isLink";
import { UpdateTemplateSettingsCommand } from "@/commands/template/UpdateTemplateSettingsCommand";
import { levels } from "@/richtext/core/extensions/nodes/Heading";
import type { NodeCallback, Predicate } from "@/richtext/core/extensions/types";
import type { Command } from "@/commands/Command";
import { UpdateBlockCommand } from "@/commands/blocks/UpdateBlockCommand";

const TEMPLATE_WIDTH = {
  min: 325,
};

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

export const SettingsTab = () => {
  const template = useCanvasStore((store) => store.template);
  const getTemplate = useCanvasStore((store) => store.getTemplate);
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const [showBackgroundImageModal, setShowBackgroundImageModal] =
    useState(false);

  // Estado separado para metadatos de la imagen
  const [imageMetadata, setImageMetadata] = useState<{
    fileName?: string;
    fileSize?: number;
    dimensions?: { width: number; height: number };
  }>({});

  const templateWidth = template?.styles?.width || 600;
  const backgroundColor = template?.styles?.backgroundColor || "#ffffff";

  // Estado local para el input de width
  const [widthInputValue, setWidthInputValue] = useState<string>(
    String(templateWidth)
  );

  // Sincronizar el input con el template cuando cambie externamente (undo/redo)
  useEffect(() => {
    setWidthInputValue(String(templateWidth));
  }, [templateWidth]);

  const backgroundConfigFromCSS = cssToConfig({
    backgroundImage: template?.styles?.backgroundImage,
    backgroundRepeat: template?.styles?.backgroundRepeat,
    backgroundSize: template?.styles?.backgroundSize,
    backgroundPosition: template?.styles?.backgroundPosition,
  });

  // Combinar config CSS con metadatos
  const backgroundConfig = backgroundConfigFromCSS
    ? {
        ...backgroundConfigFromCSS,
        ...imageMetadata,
      }
    : undefined;

  const handleWidthChange = useDebouncedCallback((newWidth: number) => {
    // Solo ejecutar el comando si el valor es válido
    if (!isNaN(newWidth) && newWidth >= TEMPLATE_WIDTH.min) {
      const command = new UpdateTemplateStylesCommand({
        getTemplate,
        setTemplate,
        styles: { width: newWidth },
      });
      historyService.executeCommand(command, {
        id: generateId(),
        type: "template.update.width",
        timestamp: Date.now(),
      });
    }
  }, 300);

  const handleWidthInputChange = (value: string) => {
    // Actualizar el estado local inmediatamente
    setWidthInputValue(value);

    // Intentar convertir a número y ejecutar el comando si es válido
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= TEMPLATE_WIDTH.min) {
      handleWidthChange(numValue);
    }
  };

  const handleWidthButtonClick = (newWidth: number) => {
    const validWidth = Math.max(TEMPLATE_WIDTH.min, newWidth);
    setWidthInputValue(String(validWidth));
    handleWidthChange(validWidth);
  };

  const handleBackgroundColorChange = useDebouncedCallback((color: string) => {
    const command = new UpdateTemplateStylesCommand({
      getTemplate,
      setTemplate,
      styles: { backgroundColor: color },
    });
    historyService.executeCommand(command, {
      id: generateId(),
      type: "template.update.backgroundColor",
      timestamp: Date.now(),
    });
  }, 300);

  const handleBackgroundConfigChange = useDebouncedCallback(
    (config: BackgroundImageConfig | undefined) => {
      const cssStyles = config
        ? configToCSS(config)
        : {
            backgroundImage: undefined,
            backgroundRepeat: undefined,
            backgroundSize: undefined,
            backgroundPosition: undefined,
          };

      const command = new UpdateTemplateStylesCommand({
        getTemplate,
        setTemplate,
        styles: cssStyles,
      });

      historyService.executeCommand(command, {
        id: generateId(),
        type: "template.update.backgroundImage",
        timestamp: Date.now(),
      });
    },
    300
  );

  const handleImageSelected = (imageFile: ImageFile) => {
    // Guardar metadatos en estado separado
    setImageMetadata({
      fileName: imageFile.fileName,
      fileSize: imageFile.fileSize,
      dimensions: imageFile.dimensions,
    });

    const newConfig: BackgroundImageConfig = {
      url: imageFile.url,
      fileName: imageFile.fileName,
      fileSize: imageFile.fileSize,
      dimensions: imageFile.dimensions,
      repeat: backgroundConfig?.repeat ?? false,
      position: backgroundConfig?.position ?? {
        vertical: "top",
        horizontal: "left",
      },
      size: backgroundConfig?.size ?? { width: "auto", height: "auto" },
    };

    handleBackgroundConfigChange(newConfig);
  };

  const handleToggleBackgroundImage = (enabled: boolean) => {
    if (enabled) {
      setShowBackgroundImageModal(true);
    } else {
      setImageMetadata({});
      handleBackgroundConfigChange(undefined);
    }
  };

  const handleDeleteBackgroundImage = () => {
    setImageMetadata({});
    handleBackgroundConfigChange(undefined);
  };

  const handleChangeImage = () => {
    setShowBackgroundImageModal(true);
  };

  const handleCloseModal = () => {
    setShowBackgroundImageModal(false);
  };

  const handleLoadFromUrl = (
    url: string,
    dimensions: { width: number; height: number }
  ) => {
    // Guardar metadatos en estado separado
    setImageMetadata({
      fileName: url.split("/").pop() || "image",
      fileSize: 0,
      dimensions,
    });

    const newConfig: BackgroundImageConfig = {
      url,
      fileName: url.split("/").pop() || "image",
      fileSize: 0,
      dimensions,
      repeat: backgroundConfig?.repeat ?? false,
      position: backgroundConfig?.position ?? {
        vertical: "top",
        horizontal: "left",
      },
      size: backgroundConfig?.size ?? { width: "auto", height: "auto" },
    };

    handleBackgroundConfigChange(newConfig);
  };

  // Text Styles State
  const [showTextStyles, setShowTextStyles] = useState(false);
  const [expandedHeading, setExpandedHeading] = useState<number | null>(null);

  // Estado local para los inputs (no sincronizado con template.settings)
  const [localSettings, setLocalSettings] = useState<TemplateSettings | null>(
    null
  );

  // Sincronizar estado local cuando cambie el template (undo/redo)
  useEffect(() => {
    if (template?.settings) {
      setLocalSettings(template.settings);
    }
  }, [template?.settings]);

  // Generic handler for updating specific text style properties
  const handleSettingsUpdate = useDebouncedCallback(
    (
      newSettings: TemplateSettings,
      predicate: Predicate,
      callback: NodeCallback
    ) => {
      if (!template) return;
      const blocksCoordinates = useCanvasStore
        .getState()
        .getBlocksByTypes(["text"]);

      const commands: Command[] = [];
      blocksCoordinates.forEach(({ rowIndex, columnIndex, blockIndex }) => {
        const newContent = applyGlobalStyles({
          getTemplate,
          setTemplate,
          rowIndex,
          columnIndex,
          blockIndex,
          editor: getOrCreateGlobalEditor(template),
          predicate,
          callback,
        });

        if (newContent)
          commands.push(
            new UpdateBlockCommand({
              getTemplate,
              setTemplate,
              rowIndex,
              columnIndex,
              blockIndex,
              updates: { content: newContent },
            })
          );
      });
      if (!commands.length) return;

      const batchCommands = new BatchCommand([
        new UpdateTemplateSettingsCommand({
          getTemplate,
          setTemplate,
          settings: newSettings,
        }),
        ...commands,
      ]);
      historyService.executeCommand(batchCommands, {
        id: generateId(),
        type: "template.global.styles",
        timestamp: Date.now(),
      });
    },
    300
  );

  // Handler for updating button block styles
  const handleButtonSettingsUpdate = useDebouncedCallback(
    (newSettings: TemplateSettings, styleUpdates: React.CSSProperties) => {
      if (!template) return;
      const blocksCoordinates = useCanvasStore
        .getState()
        .getBlocksByTypes(["button"]);

      const commands: Command[] = [];
      blocksCoordinates.forEach(({ rowIndex, columnIndex, blockIndex }) => {
        const block =
          template.rows[rowIndex].columns[columnIndex].blocks[blockIndex];

        commands.push(
          new UpdateBlockCommand({
            getTemplate,
            setTemplate,
            rowIndex,
            columnIndex,
            blockIndex,
            updates: {
              style: {
                ...block.style,
                ...styleUpdates,
              },
            },
          })
        );
      });

      const batchCommands = new BatchCommand([
        new UpdateTemplateSettingsCommand({
          getTemplate,
          setTemplate,
          settings: newSettings,
        }),
        ...commands,
      ]);

      historyService.executeCommand(batchCommands, {
        id: generateId(),
        type: "template.global.button.styles",
        timestamp: Date.now(),
      });
    },
    300
  );

  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 10 }}
    >
      <div>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Template Width
        </label>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => handleWidthButtonClick(templateWidth - 10)}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            -
          </button>
          <input
            type="number"
            value={widthInputValue}
            min={TEMPLATE_WIDTH.min}
            onChange={(e) => handleWidthInputChange(e.target.value)}
            style={{ width: "80px", padding: "6px", textAlign: "center" }}
          />
          <button
            onClick={() => handleWidthButtonClick(templateWidth + 10)}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Background Color
        </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => handleBackgroundColorChange(e.target.value)}
          style={{ width: "100%", height: "40px", cursor: "pointer" }}
        />
      </div>

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
            checked={!!backgroundConfig}
            onChange={(e) => handleToggleBackgroundImage(e.target.checked)}
          />
          <span style={{ fontWeight: "bold" }}>Background Image</span>
        </label>

        {backgroundConfig && (
          <div style={{ marginTop: "12px" }}>
            <BackgroundImagePreview
              config={backgroundConfig}
              onConfigChange={handleBackgroundConfigChange}
              onDelete={handleDeleteBackgroundImage}
              onChangeImage={handleChangeImage}
              onLoadFromUrl={handleLoadFromUrl}
            />
          </div>
        )}
      </div>

      {showBackgroundImageModal && (
        <BackgroundImageModal
          currentImageUrl={backgroundConfig?.url}
          onImageSelected={handleImageSelected}
          onClose={handleCloseModal}
        />
      )}

      <div
        style={{
          marginTop: "16px",
          borderTop: "1px solid #ddd",
          paddingTop: "16px",
        }}
      >
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
            checked={showTextStyles}
            onChange={(e) => setShowTextStyles(e.target.checked)}
          />
          <span style={{ fontWeight: "bold" }}>Global Text Styles</span>
        </label>

        {showTextStyles && localSettings && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Headings */}
            {levels.map((level) => (
              <div
                key={`heading-${level}`}
                style={{ border: "1px solid #ddd", borderRadius: "4px" }}
              >
                <button
                  onClick={() =>
                    setExpandedHeading(expandedHeading === level ? null : level)
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Heading {level}</span>
                  <span>{expandedHeading === level ? "−" : "+"}</span>
                </button>
                {expandedHeading === level && (
                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
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
                        value={
                          localSettings.heading.level[level].fontFamily || ""
                        }
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            heading: {
                              ...localSettings.heading,
                              level: {
                                ...localSettings.heading.level,
                                [level]: {
                                  ...localSettings.heading.level[level],
                                  fontFamily: e.target.value,
                                },
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                          handleSettingsUpdate(
                            newSettings,
                            ({ node }) => isHeadingLevel(node, level),
                            ({ node, pos }, tr) => {
                              if (node) {
                                tr.setNodeMarkup(pos, undefined, {
                                  ...node.attrs,
                                  fontFamily: e.target.value,
                                });
                              }
                            }
                          );
                        }}
                        style={{ width: "100%", padding: "4px 8px" }}
                      >
                        {FONT_FAMILIES.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "12px",
                          display: "block",
                          marginBottom: "2px",
                        }}
                      >
                        Font Size
                      </label>
                      <input
                        type="text"
                        value={
                          localSettings.heading.level[level].fontSize || ""
                        }
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            heading: {
                              ...localSettings.heading,
                              level: {
                                ...localSettings.heading.level,
                                [level]: {
                                  ...localSettings.heading.level[level],
                                  fontSize: e.target.value,
                                },
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                          handleSettingsUpdate(
                            newSettings,
                            ({ node }) => isHeadingLevel(node, level),
                            ({ node, pos }, tr) => {
                              if (node) {
                                tr.setNodeMarkup(pos, undefined, {
                                  ...node.attrs,
                                  fontSize: e.target.value,
                                });
                              }
                            }
                          );
                        }}
                        style={{ width: "100%", padding: "4px 8px" }}
                        placeholder="e.g., 16px, 1.2em"
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
                        Line Height
                      </label>
                      <input
                        type="text"
                        value={
                          localSettings.heading.level[level].lineHeight || ""
                        }
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            heading: {
                              ...localSettings.heading,
                              level: {
                                ...localSettings.heading.level,
                                [level]: {
                                  ...localSettings.heading.level[level],
                                  lineHeight: e.target.value,
                                },
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                          handleSettingsUpdate(
                            newSettings,
                            ({ node }) => isHeadingLevel(node, level),
                            ({ node, pos }, tr) => {
                              if (node) {
                                tr.setNodeMarkup(pos, undefined, {
                                  ...node.attrs,
                                  lineHeight: e.target.value,
                                });
                              }
                            }
                          );
                        }}
                        style={{ width: "100%", padding: "4px 8px" }}
                        placeholder="e.g., 1.5, 24px"
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
                        Letter Spacing
                      </label>
                      <input
                        type="text"
                        value={
                          localSettings.heading.level[level].letterSpacing || ""
                        }
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            heading: {
                              ...localSettings.heading,
                              level: {
                                ...localSettings.heading.level,
                                [level]: {
                                  ...localSettings.heading.level[level],
                                  letterSpacing: e.target.value,
                                },
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                          handleSettingsUpdate(
                            newSettings,
                            ({ node }) => isHeadingLevel(node, level),
                            ({ node, pos }, tr) => {
                              if (node) {
                                tr.setNodeMarkup(pos, undefined, {
                                  ...node.attrs,
                                  letterSpacing: e.target.value,
                                });
                              }
                            }
                          );
                        }}
                        style={{ width: "100%", padding: "4px 8px" }}
                        placeholder="e.g., 0.05em, 1px"
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
                        Color
                      </label>
                      <input
                        type="color"
                        value={
                          localSettings.heading.level[level].color || "#000000"
                        }
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            heading: {
                              ...localSettings.heading,
                              level: {
                                ...localSettings.heading.level,
                                [level]: {
                                  ...localSettings.heading.level[level],
                                  color: e.target.value,
                                },
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                          handleSettingsUpdate(
                            newSettings,
                            ({ node }) => isHeadingLevel(node, level),
                            ({ node, pos }, tr) => {
                              if (node) {
                                tr.setNodeMarkup(pos, undefined, {
                                  ...node.attrs,
                                  color: e.target.value,
                                });
                              }
                            }
                          );
                        }}
                        style={{
                          width: "100%",
                          height: "32px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Paragraph */}
            <div style={{ border: "1px solid #ddd", borderRadius: "4px" }}>
              <button
                onClick={() =>
                  setExpandedHeading(expandedHeading === 0 ? null : 0)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#f5f5f5",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Paragraph</span>
                <span>{expandedHeading === 0 ? "−" : "+"}</span>
              </button>
              {expandedHeading === 0 && (
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
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
                      value={localSettings.paragraph.fontFamily || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          paragraph: {
                            ...localSettings.paragraph,
                            fontFamily: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleSettingsUpdate(
                          newSettings,
                          ({ node }) => isParagraph(node),
                          ({ node, pos }, tr) => {
                            if (node) {
                              tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                fontFamily: e.target.value,
                              });
                            }
                          }
                        );
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      Font Size
                    </label>
                    <input
                      type="text"
                      value={localSettings.paragraph.fontSize || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          paragraph: {
                            ...localSettings.paragraph,
                            fontSize: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleSettingsUpdate(
                          newSettings,
                          ({ node }) => isParagraph(node),
                          ({ node, pos }, tr) => {
                            if (node) {
                              tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                fontSize: e.target.value,
                              });
                            }
                          }
                        );
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 16px, 1em"
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
                      Line Height
                    </label>
                    <input
                      type="text"
                      value={localSettings.paragraph.lineHeight || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          paragraph: {
                            ...localSettings.paragraph,
                            lineHeight: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleSettingsUpdate(
                          newSettings,
                          ({ node }) => isParagraph(node),
                          ({ node, pos }, tr) => {
                            if (node) {
                              tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                lineHeight: e.target.value,
                              });
                            }
                          }
                        );
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 1.5, 24px"
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
                      Letter Spacing
                    </label>
                    <input
                      type="text"
                      value={localSettings.paragraph.letterSpacing || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          paragraph: {
                            ...localSettings.paragraph,
                            letterSpacing: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleSettingsUpdate(
                          newSettings,
                          ({ node }) => isParagraph(node),
                          ({ node, pos }, tr) => {
                            if (node) {
                              tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                letterSpacing: e.target.value,
                              });
                            }
                          }
                        );
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 0.05em, 1px"
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
                      Color
                    </label>
                    <input
                      type="color"
                      value={localSettings.paragraph.color || "#000000"}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          paragraph: {
                            ...localSettings.paragraph,
                            color: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleSettingsUpdate(
                          newSettings,
                          ({ node }) => isParagraph(node),
                          ({ node, pos }, tr) => {
                            if (node) {
                              tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                color: e.target.value,
                              });
                            }
                          }
                        );
                      }}
                      style={{
                        width: "100%",
                        height: "32px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div style={{ border: "1px solid #ddd", borderRadius: "4px" }}>
              <button
                onClick={() =>
                  setExpandedHeading(expandedHeading === -1 ? null : -1)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#f5f5f5",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Links</span>
                <span>{expandedHeading === -1 ? "−" : "+"}</span>
              </button>
              {expandedHeading === -1 && (
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      Color
                    </label>
                    <input
                      type="color"
                      value={localSettings.link.color || "#0000ff"}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          link: {
                            ...localSettings.link,
                            color: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleSettingsUpdate(
                          newSettings,
                          ({ mark }) => isLink(mark),
                          ({ node, mark, state, pos }, tr) => {
                            if (!mark || !node) return;

                            const linkType = state.schema.marks.link;
                            const start = pos;
                            const end = pos + node.nodeSize;

                            tr.removeMark(start, end, linkType);
                            tr.addMark(
                              start,
                              end,
                              linkType.create({
                                ...mark.attrs,
                                color: e.target.value,
                              })
                            );
                          }
                        );
                      }}
                      style={{
                        width: "100%",
                        height: "32px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
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
                        checked={localSettings.link.isUnderlined ?? true}
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            link: {
                              ...localSettings.link,
                              isUnderlined: e.target.checked,
                            },
                          };
                          setLocalSettings(newSettings);

                          handleSettingsUpdate(
                            newSettings,
                            ({ mark }) => isLink(mark),
                            ({ node, mark, state, pos }, tr) => {
                              if (!mark || !node) return;

                              const linkType = state.schema.marks.link;
                              const start = pos;
                              const end = pos + node.nodeSize;

                              tr.removeMark(start, end, linkType);
                              tr.addMark(
                                start,
                                end,
                                linkType.create({
                                  ...mark.attrs,
                                  isUnderlined: e.target.checked,
                                })
                              );
                            }
                          );
                        }}
                      />
                      <span style={{ fontSize: "12px" }}>Underlined</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ border: "1px solid #ddd", borderRadius: "4px" }}>
              <button
                onClick={() =>
                  setExpandedHeading(expandedHeading === -2 ? null : -2)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#f5f5f5",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Buttons</span>
                <span>{expandedHeading === -2 ? "−" : "+"}</span>
              </button>
              {expandedHeading === -2 && (
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={localSettings.button?.backgroundColor || "#3498db"}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            backgroundColor: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          backgroundColor: e.target.value,
                        });
                      }}
                      style={{
                        width: "100%",
                        height: "32px",
                        cursor: "pointer",
                      }}
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
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={localSettings.button?.color || "#ffffff"}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            color: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          color: e.target.value,
                        });
                      }}
                      style={{
                        width: "100%",
                        height: "32px",
                        cursor: "pointer",
                      }}
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
                      Padding (e.g., 12px 24px)
                    </label>
                    <input
                      type="text"
                      value={localSettings.button?.padding || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            padding: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          padding: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 12px 24px"
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
                      Border Radius (e.g., 4px)
                    </label>
                    <input
                      type="text"
                      value={localSettings.button?.borderRadius || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            borderRadius: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          borderRadius: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 4px"
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
                      Font Size
                    </label>
                    <input
                      type="text"
                      value={localSettings.button?.fontSize || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            fontSize: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          fontSize: e.target.value,
                        });
                      }}
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
                      value={localSettings.button?.fontFamily || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            fontFamily: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          fontFamily: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      Font Weight
                    </label>
                    <select
                      value={localSettings.button?.fontWeight || "600"}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            fontWeight: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          fontWeight: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                    >
                      <option value="normal">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi Bold</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      Line Height
                    </label>
                    <input
                      type="text"
                      value={localSettings.button?.lineHeight || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            lineHeight: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          lineHeight: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 1.2"
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
                      Text Decoration
                    </label>
                    <select
                      value={localSettings.button?.textDecoration || "none"}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            textDecoration: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          textDecoration: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                    >
                      <option value="none">None</option>
                      <option value="underline">Underline</option>
                      <option value="line-through">Line Through</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      Border (e.g., 2px solid #000)
                    </label>
                    <input
                      type="text"
                      value={localSettings.button?.border || ""}
                      onChange={(e) => {
                        const newSettings = {
                          ...localSettings,
                          button: {
                            ...localSettings.button,
                            border: e.target.value,
                          },
                        };
                        setLocalSettings(newSettings);
                        handleButtonSettingsUpdate(newSettings, {
                          border: e.target.value,
                        });
                      }}
                      style={{ width: "100%", padding: "4px 8px" }}
                      placeholder="e.g., 2px solid #000000"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
