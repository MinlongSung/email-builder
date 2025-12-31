import type { Coordinates } from "@/dnd/core/types";

export interface AutoScrollConfig {
  enabled: boolean;
  scrollSpeed: number;
  edgeThreshold: number;
}

export class AutoScroller {
  private scrollRafId: number | null = null;
  private scrollContainers: HTMLElement[] = [];
  private config: AutoScrollConfig;

  constructor(config: AutoScrollConfig) {
    this.config = config;
  }

  start(getCoordinates: () => Coordinates, isDragging: () => boolean): void {
    if (
      !this.config.enabled ||
      !this.config.edgeThreshold ||
      !this.config.scrollSpeed
    ) {
      return;
    }

    // Cachear contenedores scrollables al inicio
    if (this.scrollContainers.length === 0) {
      this.scrollContainers = this.getScrollContainers();
    }

    // Iniciar loop de scroll si no está activo
    if (!this.scrollRafId) {
      this.startScrollLoop(getCoordinates, isDragging);
    }
  }

  stop(): void {
    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    this.scrollContainers = [];
  }

  private startScrollLoop(
    getCoordinates: () => Coordinates,
    isDragging: () => boolean
  ): void {
    const scrollFrame = () => {
      if (!isDragging()) {
        this.scrollRafId = null;
        return;
      }

      const threshold = this.config.edgeThreshold;
      const baseSpeed = this.config.scrollSpeed;

      // Obtener las coordenadas actuales en cada frame
      const coordinates = getCoordinates();

      // Encontrar el contenedor activo (donde está el cursor)
      const activeContainer = this.findActiveScrollContainer(coordinates);
      if (!activeContainer) {
        this.scrollRafId = requestAnimationFrame(scrollFrame);
        return;
      }

      // Solo hacer scroll del contenedor activo
      const {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
      } = activeContainer;

      const rect = activeContainer.getBoundingClientRect();

      const distanceTop = coordinates.y - rect.top;
      const distanceBottom = rect.bottom - coordinates.y;
      const distanceLeft = coordinates.x - rect.left;
      const distanceRight = rect.right - coordinates.x;

      let scrollX = 0;
      let scrollY = 0;

      // Scroll vertical con aceleración
      if (distanceTop < threshold && scrollTop > 0) {
        const intensity = 1 - distanceTop / threshold;
        scrollY = -baseSpeed * (1 + intensity);
      } else if (
        distanceBottom < threshold &&
        scrollTop + clientHeight < scrollHeight
      ) {
        const intensity = 1 - distanceBottom / threshold;
        scrollY = baseSpeed * (1 + intensity);
      }

      // Scroll horizontal con aceleración
      if (distanceLeft < threshold && scrollLeft > 0) {
        const intensity = 1 - distanceLeft / threshold;
        scrollX = -baseSpeed * (1 + intensity);
      } else if (
        distanceRight < threshold &&
        scrollLeft + clientWidth < scrollWidth
      ) {
        const intensity = 1 - distanceRight / threshold;
        scrollX = baseSpeed * (1 + intensity);
      }

      // Aplicar scroll
      if (scrollX !== 0 || scrollY !== 0) {
        activeContainer.scrollBy(scrollX, scrollY);
      }

      // Continuar el loop
      this.scrollRafId = requestAnimationFrame(scrollFrame);
    };

    this.scrollRafId = requestAnimationFrame(scrollFrame);
  }

  private findActiveScrollContainer(
    coordinates: Coordinates
  ): HTMLElement | null {
    // Obtener elemento bajo el cursor
    let el = document.elementFromPoint(
      coordinates.x,
      coordinates.y
    ) as HTMLElement | null;

    // Buscar en los padres hasta encontrar un contenedor cacheado
    while (el) {
      if (this.scrollContainers.includes(el)) {
        return el;
      }
      el = el.parentElement;
    }

    // Si no se encuentra ninguno, usar document.documentElement por defecto
    return null;
  }

  private getScrollContainers(): HTMLElement[] {
    const containers: HTMLElement[] = [];

    // Buscar TODOS los elementos con scroll en el documento
    const allElements = document.querySelectorAll("*");

    allElements.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;

      const style = window.getComputedStyle(el);
      const overflow = style.overflow + style.overflowX + style.overflowY;

      if (/(auto|scroll)/.test(overflow)) {
        // Verificar si realmente tiene contenido scrollable
        if (
          el.scrollHeight > el.clientHeight ||
          el.scrollWidth > el.clientWidth
        ) {
          containers.push(el);
        }
      }
    });

    return containers;
  }
}
