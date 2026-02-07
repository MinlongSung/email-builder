// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { getCoordinatesDelta, hasExceededDistance, getEventCoordinates } from '../utils';

describe('getCoordinatesDelta', () => {
    it('returns the difference between two coordinates', () => {
        const delta = getCoordinatesDelta({ x: 10, y: 20 }, { x: 30, y: 50 });
        expect(delta).toEqual({ x: 20, y: 30 });
    });

    it('returns negative values when end is before start', () => {
        const delta = getCoordinatesDelta({ x: 50, y: 50 }, { x: 10, y: 20 });
        expect(delta).toEqual({ x: -40, y: -30 });
    });

    it('returns zero when coordinates are the same', () => {
        const delta = getCoordinatesDelta({ x: 5, y: 5 }, { x: 5, y: 5 });
        expect(delta).toEqual({ x: 0, y: 0 });
    });
});

describe('hasExceededDistance', () => {
    it('returns true when distance exceeds threshold', () => {
        // distance = sqrt(3^2 + 4^2) = 5
        expect(hasExceededDistance({ x: 3, y: 4 }, 4)).toBe(true);
    });

    it('returns false when distance is below threshold', () => {
        expect(hasExceededDistance({ x: 3, y: 4 }, 6)).toBe(false);
    });

    it('returns false when distance equals threshold', () => {
        // sqrt(3^2 + 4^2) = 5, threshold = 5 => not exceeded (strict >)
        expect(hasExceededDistance({ x: 3, y: 4 }, 5)).toBe(false);
    });

    it('handles zero delta', () => {
        expect(hasExceededDistance({ x: 0, y: 0 }, 1)).toBe(false);
    });

    it('handles only horizontal movement', () => {
        expect(hasExceededDistance({ x: 10, y: 0 }, 5)).toBe(true);
    });

    it('handles only vertical movement', () => {
        expect(hasExceededDistance({ x: 0, y: 10 }, 5)).toBe(true);
    });

    it('handles negative deltas (absolute distance)', () => {
        // sqrt((-3)^2 + (-4)^2) = 5
        expect(hasExceededDistance({ x: -3, y: -4 }, 4)).toBe(true);
    });
});

describe('getEventCoordinates', () => {
    it('extracts coordinates from MouseEvent', () => {
        const event = new MouseEvent('mousedown', { clientX: 100, clientY: 200 });
        expect(getEventCoordinates(event)).toEqual({ x: 100, y: 200 });
    });

    it('extracts coordinates from TouchEvent', () => {
        const touch = { clientX: 150, clientY: 250 } as Touch;
        const event = new TouchEvent('touchstart', { touches: [touch] });
        expect(getEventCoordinates(event)).toEqual({ x: 150, y: 250 });
    });

    it('uses changedTouches when touches is empty', () => {
        const touch = { clientX: 50, clientY: 75 } as Touch;
        const event = new TouchEvent('touchend', { changedTouches: [touch] });
        expect(getEventCoordinates(event)).toEqual({ x: 50, y: 75 });
    });

    it('returns {0,0} for unknown event types', () => {
        const event = new Event('custom');
        expect(getEventCoordinates(event)).toEqual({ x: 0, y: 0 });
    });
});
