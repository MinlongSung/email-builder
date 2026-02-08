import type { Middleware, Placement } from "@floating-ui/dom";

interface Props {
    padding: number;
}

export const gap = (options: Props): Middleware => {
    const { padding } = options;
    return {
        name: 'gap',
        fn(state) {
            const { placement, elements } = state;

            const paddingMap: Record<Placement, string> = {
                top: `0 ${padding}px ${padding}px ${padding}px`,
                'right-start': `0 ${padding}px ${padding}px ${padding}px`,
                'left-start': `0 ${padding}px ${padding}px ${padding}px`,
                
                right: `${padding}px 0 ${padding}px ${padding}px`,
                'top-end': `${padding}px 0 ${padding}px ${padding}px`,
                'bottom-end': `${padding}px 0 ${padding}px ${padding}px`,
                
                bottom: `${padding}px ${padding}px 0 ${padding}px`,
                'right-end': `${padding}px ${padding}px 0 ${padding}px`,
                'left-end': `${padding}px ${padding}px 0 ${padding}px`,
                
                left: `${padding}px ${padding}px ${padding}px 0`,
                'top-start': `${padding}px ${padding}px ${padding}px 0`,
                'bottom-start': `${padding}px ${padding}px ${padding}px 0`,
            };

            elements.floating.style.padding = paddingMap[placement];

            return state;
        }
    };
};
