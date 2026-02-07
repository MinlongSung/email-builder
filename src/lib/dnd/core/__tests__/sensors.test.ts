// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { MouseSensor } from '../sensors/MouseSensor';
import { TouchSensor } from '../sensors/TouchSensor';

describe('MouseSensor activators', () => {
    it('has a single mousedown activator', () => {
        expect(MouseSensor.activators).toHaveLength(1);
        expect(MouseSensor.activators[0].eventName).toBe('mousedown');
    });

    it('accepts left click (button 0)', () => {
        const event = new MouseEvent('mousedown', { button: 0 });
        expect(MouseSensor.activators[0].handler(event)).toBe(true);
    });

    it('accepts middle click (button 1)', () => {
        const event = new MouseEvent('mousedown', { button: 1 });
        expect(MouseSensor.activators[0].handler(event)).toBe(true);
    });

    it('rejects right click (button 2)', () => {
        const event = new MouseEvent('mousedown', { button: 2 });
        expect(MouseSensor.activators[0].handler(event)).toBe(false);
    });
});

describe('TouchSensor activators', () => {
    it('has a single touchstart activator', () => {
        expect(TouchSensor.activators).toHaveLength(1);
        expect(TouchSensor.activators[0].eventName).toBe('touchstart');
    });

    it('accepts single touch', () => {
        const touch = { clientX: 0, clientY: 0 } as Touch;
        const event = new TouchEvent('touchstart', { touches: [touch] });
        expect(TouchSensor.activators[0].handler(event)).toBe(true);
    });

    it('rejects multi-touch', () => {
        const t1 = { clientX: 0, clientY: 0 } as Touch;
        const t2 = { clientX: 10, clientY: 10 } as Touch;
        const event = new TouchEvent('touchstart', { touches: [t1, t2] });
        expect(TouchSensor.activators[0].handler(event)).toBe(false);
    });
});
