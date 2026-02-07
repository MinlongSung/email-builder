import type { CollisionDetection, Coordinates, DroppableContainer } from "./types";

export function getCoordinatesDelta(
    start: Coordinates,
    end: Coordinates
): Coordinates {
    return { x: end.x - start.x, y: end.y - start.y };
}

export function hasExceededDistance(delta: Coordinates, threshold: number): boolean {
    return Math.sqrt(delta.x ** 2 + delta.y ** 2) > threshold
}

export function getEventCoordinates(event: Event): Coordinates {
    if (event instanceof MouseEvent) {
        return { x: event.clientX, y: event.clientY };
    }

    if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (touch) {
            return { x: touch.clientX, y: touch.clientY };
        }
    }

    return { x: 0, y: 0 };
}

function distanceBetween(p1: Coordinates, p2: Coordinates): number {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export const pointerWithin: CollisionDetection = ({
    draggable,
    droppables,
    coordinates
}) => {
    if (!draggable) return [];

    const { x, y } = coordinates;
    const type = draggable.data?.type;
    const over = document.elementFromPoint(x, y);

    const collisions: { droppable: DroppableContainer, distance: number }[] = [];

    for (const droppable of droppables) {
        const rect = droppable.rect;
        if (!rect) continue;

        const accepts = droppable.data?.accepts;
        const isValid = !accepts || accepts.length === 0 || accepts.includes(type);
        if (!isValid) continue;

        if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom &&
            droppable.element.contains(over)
        ) {
            const corners: Coordinates[] = [
                { x: rect.left, y: rect.top },
                { x: rect.right, y: rect.top },
                { x: rect.left, y: rect.bottom },
                { x: rect.right, y: rect.bottom }
            ];

            const totalDistance = corners.reduce((sum, corner) => {
                return sum + distanceBetween(coordinates, corner);
            }, 0);

            const avgDistance = totalDistance / 4;
            collisions.push({ droppable, distance: avgDistance });
        }
    }

    return collisions
        .sort((a, b) => a.distance - b.distance)
        .map(c => c.droppable);
}