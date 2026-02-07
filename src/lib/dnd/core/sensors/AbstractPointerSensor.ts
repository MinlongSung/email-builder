import type { Coordinates, PointerEventHandlers, SensorProps } from "../types";
import { getCoordinatesDelta, getEventCoordinates, hasExceededDistance } from "../utils";

export class AbstractPointerSensor {
    private isDragging: boolean = false;
    private initialCoordinates: Coordinates;
    private holdTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private rafId: number | null = null;

    constructor(
        private props: SensorProps,
        private events: PointerEventHandlers
    ) {
        this.initialCoordinates = getEventCoordinates(this.props.event);

        const { move, end, cancel } = this.events;
        document.addEventListener(move.name, this.handleMove, {
            passive: false,
        });
        document.addEventListener(end.name, this.handleEnd);
        if (cancel) document.addEventListener(cancel.name, this.handleCancel);

        const { activationConstraint } = this.props.options;
        if (activationConstraint.hold) {
            this.holdTimeoutId = setTimeout(
                this.handleStart,
                activationConstraint.hold
            );
            return;
        }

        this.handleStart();
    }

    handleStart = () => {
        this.isDragging = true;
        document.body.style.touchAction = "none";
        document.body.style.cursor = "grabbing";
        this.removeTextSelection();
        document.addEventListener("selectionchange", this.removeTextSelection);
        this.props.onStart(this.initialCoordinates);
    }

    handleMove = (event: Event) => {
        if (!this.initialCoordinates) return;
        if (event.cancelable) event.preventDefault();

        if (this.rafId === null) {
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;
                const coordinates = getEventCoordinates(event);
                const delta = getCoordinatesDelta(this.initialCoordinates, coordinates);
                const { tolerance, distance } = this.props.options.activationConstraint;
                if (!this.isDragging && this.props.options.activationConstraint) {
                    if (tolerance !== undefined && hasExceededDistance(delta, tolerance)) return this.handleCancel();
                    if (distance !== undefined && hasExceededDistance(delta, distance)) return this.handleStart();
                    return;
                }
                this.props.onMove(coordinates);
            });
        }
    }

    handleEnd = () => {
        this.props.onEnd();
        this.destroy();
    }

    handleCancel = () => {
        this.props.onCancel();
        this.destroy();
    }

    private destroy() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        document.body.style.touchAction = "";
        document.body.style.cursor = "";
        document.removeEventListener("selectionchange", this.removeTextSelection);

        const { move, end, cancel } = this.events;
        document.removeEventListener(move.name, this.handleMove);
        document.removeEventListener(end.name, this.handleEnd);
        if (cancel) document.removeEventListener(cancel.name, this.handleCancel);

        this.isDragging = false;
        this.initialCoordinates = { x: 0, y: 0 };
        if (this.holdTimeoutId !== null) {
            clearTimeout(this.holdTimeoutId);
            this.holdTimeoutId = null;
        }
    }

    private removeTextSelection = () => {
        document.getSelection()?.removeAllRanges();
    }
}