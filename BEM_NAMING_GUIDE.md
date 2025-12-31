# BEM Naming Convention Guide

## Overview
This project uses BEM (Block Element Modifier) methodology for CSS class naming to ensure maintainability and prevent naming conflicts.

## BEM Syntax

```
.block { }
.block__element { }
.block--modifier { }
.block__element--modifier { }
```

### Structure
- **Block:** Standalone entity that is meaningful on its own (e.g., `button`, `menu`, `card`)
- **Element:** Part of a block that has no standalone meaning (e.g., `button__icon`, `menu__item`)
- **Modifier:** A flag on a block or element to change appearance or behavior (e.g., `button--primary`, `menu__item--active`)

## Examples from This Codebase

### RowSidebar Component

```css
/* Block */
.rowCard {
  /* Base styles for the card */
}

/* Elements */
.rowCard__preview {
  /* Preview section inside the card */
}

.rowCard__columnPreview {
  /* Column preview container */
}

.rowCard__column {
  /* Individual column element */
}

/* Modifiers (if needed) */
.rowCard--highlighted {
  /* Highlighted state of the card */
}
```

**Usage in React:**
```tsx
<div className={styles.rowCard}>
  <div className={styles.rowCard__preview}>
    <div className={styles.rowCard__columnPreview}>
      <div className={styles.rowCard__column} />
    </div>
  </div>
</div>
```

### BlockSidebar Component

```css
/* Block */
.blockCard {
  /* Base card styles */
}

/* Elements */
.blockCard__iconWrapper {
  /* Icon container */
}

.blockCard__label {
  /* Label text */
}
```

**Usage in React:**
```tsx
<div className={styles.blockCard}>
  <div className={styles.blockCard__iconWrapper}>
    {icon}
  </div>
  <span className={styles.blockCard__label}>{label}</span>
</div>
```

### DropPlaceholder Component with Modifier

```css
/* Block */
.placeholder {
  /* Base placeholder styles */
}

/* Modifier */
.placeholder--isOver {
  /* When drag is hovering over */
}

/* Elements */
.placeholder__content {
  /* Content wrapper */
}

.placeholder__iconWrapper {
  /* Icon container */
}

.placeholder__icon {
  /* Icon element */
}
```

**Usage in React:**
```tsx
<div className={`${styles.placeholder} ${
  isOver ? styles["placeholder--isOver"] : ""
}`}>
  <div className={styles.placeholder__content}>
    <div className={styles.placeholder__iconWrapper}>
      <Icon className={styles.placeholder__icon} />
    </div>
  </div>
</div>
```

## Naming Rules

### 1. Block Names
- Use lowercase
- Words separated by single hyphen if multi-word
- Describes the purpose, not appearance
- Examples: `button`, `card`, `menu`, `drop-indicator`

### 2. Element Names
- Always preceded by block name with `__`
- Describes the role within the block
- Examples: `card__header`, `menu__item`, `button__icon`

### 3. Modifier Names
- Always preceded by block/element name with `--`
- Describes state, variant, or condition
- Examples: `button--primary`, `card--highlighted`, `menu__item--active`

## Common Patterns

### State Modifiers
```css
.button { }
.button--disabled { }
.button--loading { }
.button--active { }
```

### Variant Modifiers
```css
.button { }
.button--primary { }
.button--secondary { }
.button--ghost { }
```

### Size Modifiers
```css
.card { }
.card--small { }
.card--medium { }
.card--large { }
```

## CSS Modules Syntax

When using BEM with CSS Modules, access modifiers with bracket notation:

```tsx
// Correct
className={styles["placeholder--isOver"]}

// Also works for elements
className={styles.placeholder__icon}
className={styles["placeholder__icon"]}
```

## Do's and Don'ts

### ✅ DO

```css
/* Good: Clear hierarchy */
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }

/* Good: Semantic naming */
.searchForm { }
.searchForm__input { }
.searchForm__button { }

/* Good: State modifiers */
.button { }
.button--disabled { }
.button--loading { }
```

### ❌ DON'T

```css
/* Bad: No nested elements */
.card__header__title { }
/* Instead: */
.card__title { }

/* Bad: Appearance-based names */
.redButton { }
/* Instead: */
.button--danger { }

/* Bad: Too generic */
.item { }
/* Instead: */
.menuItem { }

/* Bad: CamelCase with hyphens mixed */
.cardItem-highlighted { }
/* Instead: */
.cardItem--highlighted { }
```

## Integration with Design Tokens

Always combine BEM with design tokens:

```css
.button {
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.button--primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
}

.button__icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}
```

## File Organization

Each component should have its CSS module with BEM naming:

```
Component/
├── Component.tsx
├── Component.module.css  # BEM classes here
└── index.ts
```

**Component.module.css:**
```css
/**
 * Component Name
 * BEM naming convention: component, component__element, component--modifier
 */

/* Block: component */
.component {
  /* Base styles */
}

/* Elements */
.component__element {
  /* Element styles */
}

/* Modifiers */
.component--modifier {
  /* Modifier styles */
}
```

## Migration Checklist

When creating or refactoring a component:

- [ ] Identify the main block (component name)
- [ ] List all child elements
- [ ] List all states/variants (modifiers)
- [ ] Use design tokens for all values
- [ ] Add BEM comment at top of CSS file
- [ ] Update component to use new class names
- [ ] Test in both light and dark modes

## Resources

- [BEM Official](https://getbem.com/)
- [BEM 101](https://css-tricks.com/bem-101/)
- [Design Tokens](./src/theme/tokens.css)
- [Utilities](./src/shared/styles/utilities.css)

## Questions?

If unsure about naming:
1. Ask: "Is this a standalone component?" → Block
2. Ask: "Is this part of a component?" → Element
3. Ask: "Is this a state or variant?" → Modifier

---

**Last Updated:** 2025-12-31
