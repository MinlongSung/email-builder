import { useState, useEffect } from "react";
import { BackgroundImageModal } from "@/components/backgroundImage/BackgroundImageModal";
import { BackgroundImagePreview } from "@/components/backgroundImage/BackgroundImagePreview";
import { type ImageFile } from "@/components/backgroundImage/ImageList";
import { type BackgroundImageConfig, configToCSS, cssToConfig } from "@/components/backgroundImage/types";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { UpdateTemplateStylesCommand } from "@/history/commands/UpdateTemplateStylesCommand";
import { historyService } from "@/history/services/historyService";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const TEMPLATE_WIDTH = {
    min: 325
}
export const SettingsTab = () => {
  const template = useCanvasStore((store) => store.template);
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const [showBackgroundImageModal, setShowBackgroundImageModal] = useState(false);

  // Estado separado para metadatos de la imagen
  const [imageMetadata, setImageMetadata] = useState<{
    fileName?: string;
    fileSize?: number;
    dimensions?: { width: number; height: number };
  }>({});

  const templateWidth = template?.styles?.width || 600;
  const backgroundColor = template?.styles?.backgroundColor || "#ffffff";

  // Estado local para el input de width
  const [widthInputValue, setWidthInputValue] = useState<string>(String(templateWidth));

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
  const backgroundConfig = backgroundConfigFromCSS ? {
    ...backgroundConfigFromCSS,
    ...imageMetadata,
  } : undefined;

  const handleWidthChange = useDebouncedCallback((newWidth: number) => {
    // Solo ejecutar el comando si el valor es válido
    if (!isNaN(newWidth) && newWidth >= TEMPLATE_WIDTH.min) {
      const command = new UpdateTemplateStylesCommand({
        template,
        setTemplate,
        styles: { width: newWidth },
        type: "template.update.width",
      });
      historyService.executeCommand(command);
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
      template,
      setTemplate,
      styles: { backgroundColor: color },
      type: "template.update.backgroundColor",
    });
    historyService.executeCommand(command);
  }, 300);

  const handleBackgroundConfigChange = useDebouncedCallback((config: BackgroundImageConfig | undefined) => {
    const cssStyles = config ? configToCSS(config) : {
      backgroundImage: undefined,
      backgroundRepeat: undefined,
      backgroundSize: undefined,
      backgroundPosition: undefined,
    };

    const command = new UpdateTemplateStylesCommand({
      template,
      setTemplate,
      styles: cssStyles,
      type: "template.update.backgroundImage",
    });

    historyService.executeCommand(command);
  }, 300);

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
      position: backgroundConfig?.position ?? { vertical: 'top', horizontal: 'left' },
      size: backgroundConfig?.size ?? { width: 'auto', height: 'auto' },
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

  const handleLoadFromUrl = (url: string, dimensions: { width: number; height: number }) => {
    // Guardar metadatos en estado separado
    setImageMetadata({
      fileName: url.split('/').pop() || 'image',
      fileSize: 0,
      dimensions,
    });

    const newConfig: BackgroundImageConfig = {
      url,
      fileName: url.split('/').pop() || 'image',
      fileSize: 0,
      dimensions,
      repeat: backgroundConfig?.repeat ?? false,
      position: backgroundConfig?.position ?? { vertical: 'top', horizontal: 'left' },
      size: backgroundConfig?.size ?? { width: 'auto', height: 'auto' },
    };

    handleBackgroundConfigChange(newConfig);
  };

  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 10 }}
    >
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
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
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
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
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
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
    </section>
  );
};
