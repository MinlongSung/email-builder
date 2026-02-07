import type { Coordinates, Scrollable, ScrollableContainer, ScrollOptions } from "./types";


export class AutoScroller {
    private scrollableContainers: Map<string, ScrollableContainer> = new Map();
    private activeScrollable: ScrollableContainer | null = null;
    private coordinates: Coordinates | null = null;
    private rafId: number | null = null;

    constructor(private options: Required<ScrollOptions>) { }

    init({ scrollables }: { scrollables: Scrollable[] }) {
        scrollables.forEach(scrollable => {
            const rect = scrollable.element.getBoundingClientRect();
            this.scrollableContainers.set(scrollable.id, { ...scrollable, rect });
        });
    }

    updateCoordinates(coordinates: Coordinates) {
        this.coordinates = coordinates;
    }

    start() {
        if (this.rafId !== null) return;

        const loop = () => {
            if (!this.activeScrollable || !this.coordinates) {
                this.rafId = null;
                return;
            }
            
            const { element, rect } = this.activeScrollable;
            const { x, y } = this.coordinates;

            let dx = 0;
            let dy = 0;
            const margin = this.options.threshold;

            // Horizontal
            if (x < rect.left + margin) {
                const distance = rect.left + margin - x; // cuanto más cerca del borde, mayor la distancia
                dx = -this.options.speed * Math.min(distance / margin, 1);
            } else if (x > rect.right - margin) {
                const distance = x - (rect.right - margin);
                dx = this.options.speed * Math.min(distance / margin, 1);
            }

            // Vertical
            if (y < rect.top + margin) {
                const distance = rect.top + margin - y;
                dy = -this.options.speed * Math.min(distance / margin, 1);
            } else if (y > rect.bottom - margin) {
                const distance = y - (rect.bottom - margin);
                dy = this.options.speed * Math.min(distance / margin, 1);
            }

            if (dx || dy) element.scrollBy(dx, dy);

            this.rafId = requestAnimationFrame(loop);
        };

        this.rafId = requestAnimationFrame(loop);
    }

    setActiveScrollable(coordinates: Coordinates): void {
        this.activeScrollable = null;
        for (const scrollableContainer of this.scrollableContainers.values()) {
            const { rect } = scrollableContainer;
            if (
                coordinates.x >= rect.left &&
                coordinates.x <= rect.right &&
                coordinates.y >= rect.top &&
                coordinates.y <= rect.bottom
            ) {
                this.activeScrollable = scrollableContainer;
                break;
            }
        }
    }

    stop() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.scrollableContainers.clear();
        this.activeScrollable = null;
        this.coordinates = null;
    }
}
