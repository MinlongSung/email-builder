export type BulletStyleValue = 'disc' | 'circle' | 'square';
export type OrderedStyleValue =
    | 'decimal'
    | 'lower-alpha'
    | 'upper-alpha'
    | 'lower-roman'
    | 'upper-roman';
export type ListStyleValue = BulletStyleValue | OrderedStyleValue;

export const listStyleAttr = {
  listStyleType: {
    default: null,
    parseHTML: (el: HTMLElement) => el.style.listStyleType || null,
    renderHTML: (attrs: Record<string, unknown>) =>
      attrs.listStyleType ? { style: `list-style-type: ${attrs.listStyleType}` } : {},
  },
};

export function getListTypeByStyleValue(value?: ListStyleValue) {
    if (!value) return null;

    switch (value) {
        case 'disc':
        case 'circle':
        case 'square':
            return 'bulletList';
        default:
            return 'orderedList';
    }
}