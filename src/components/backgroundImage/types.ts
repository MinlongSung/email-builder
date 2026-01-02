/**
 * Background Image Configuration (internal use)
 * Se usa para manejar la configuración en los componentes
 */
export interface BackgroundImageConfig {
  url: string;
  fileName?: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  repeat?: boolean;
  position?: {
    vertical?: 'top' | 'center' | 'bottom' | { value: number; unit: 'px' | '%' };
    horizontal?: 'left' | 'center' | 'right' | { value: number; unit: 'px' | '%' };
  };
  size?: {
    width?: 'contain' | 'auto' | 'cover' | { value: number; unit: 'px' | '%' };
    height?: 'contain' | 'auto' | 'cover' | { value: number; unit: 'px' | '%' };
  };
}

/**
 * Convierte BackgroundImageConfig a propiedades CSS
 */
export function configToCSS(config: BackgroundImageConfig | undefined): {
  backgroundImage?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
} {
  if (!config) return {};

  const result: any = {
    backgroundImage: `url(${config.url})`,
  };

  // Background Repeat
  result.backgroundRepeat = config.repeat ? 'repeat' : 'no-repeat';

  // Background Position
  const vPos = config.position?.vertical ?? 'top';
  const hPos = config.position?.horizontal ?? 'left';

  const verticalCSS = typeof vPos === 'string' ? vPos : `${vPos.value}${vPos.unit}`;
  const horizontalCSS = typeof hPos === 'string' ? hPos : `${hPos.value}${hPos.unit}`;

  result.backgroundPosition = `${horizontalCSS} ${verticalCSS}`;

  // Background Size
  const wSize = config.size?.width ?? 'auto';
  const hSize = config.size?.height ?? 'auto';

  // Si width o height es contain/cover, usar solo ese valor
  if (wSize === 'contain' || wSize === 'cover') {
    result.backgroundSize = wSize;
  } else if (hSize === 'contain' || hSize === 'cover') {
    result.backgroundSize = hSize;
  } else {
    const widthCSS = typeof wSize === 'string' ? wSize : `${wSize.value}${wSize.unit}`;
    const heightCSS = typeof hSize === 'string' ? hSize : `${hSize.value}${hSize.unit}`;
    result.backgroundSize = `${widthCSS} ${heightCSS}`;
  }

  return result;
}

/**
 * Convierte propiedades CSS a BackgroundImageConfig
 */
export function cssToConfig(css: {
  backgroundImage?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
}): BackgroundImageConfig | undefined {
  if (!css.backgroundImage) return undefined;

  // Extract URL from url(...)
  const urlMatch = css.backgroundImage.match(/url\(['"]?(.+?)['"]?\)/);
  if (!urlMatch) return undefined;

  const config: BackgroundImageConfig = {
    url: urlMatch[1],
    repeat: css.backgroundRepeat === 'repeat',
  };

  // Parse position
  if (css.backgroundPosition) {
    const [h, v] = css.backgroundPosition.split(' ');
    config.position = {
      horizontal: parsePositionValue(h) as any,
      vertical: parsePositionValue(v) as any,
    };
  }

  // Parse size
  if (css.backgroundSize) {
    // Si es contain o cover solo, aplicar a ambos ejes
    if (css.backgroundSize === 'contain' || css.backgroundSize === 'cover') {
      config.size = {
        width: css.backgroundSize,
        height: 'auto',
      };
    } else {
      const [w, h] = css.backgroundSize.split(' ');
      config.size = {
        width: parseSizeValue(w) as any,
        height: parseSizeValue(h || w) as any,
      };
    }
  }

  return config;
}

function parsePositionValue(value: string) {
  if (['top', 'center', 'bottom', 'left', 'right'].includes(value)) {
    return value;
  }
  const match = value.match(/^(-?\d+(?:\.\d+)?)(px|%)$/);
  if (match) {
    return { value: parseFloat(match[1]), unit: match[2] as 'px' | '%' };
  }
  return 'center';
}

function parseSizeValue(value: string) {
  if (['contain', 'auto', 'cover'].includes(value)) {
    return value;
  }
  const match = value.match(/^(\d+(?:\.\d+)?)(px|%)$/);
  if (match) {
    return { value: parseFloat(match[1]), unit: match[2] as 'px' | '%' };
  }
  return 'auto';
}
