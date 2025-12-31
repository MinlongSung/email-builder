# Email Builder - Feature-Based Architecture Migration Plan

## Overview
This document outlines a safe, incremental migration strategy to reorganize the email builder codebase from a flat component structure to a feature-based architecture following the Strangler Fig Pattern.

## Phase 1: CSS Refactoring ✅ COMPLETED

### Completed Tasks
- [x] Created shared utilities CSS file (`src/shared/styles/utilities.css`)
- [x] Refactored all CSS modules to use design tokens from `tokens.css`
- [x] Implemented BEM naming convention across all components
- [x] Updated all component files to use new BEM class names
- [x] Eliminated all hardcoded colors, spacing, and shadows

### Refactored Files
1. `src/components/blocks/row/RowSidebar.module.css` - Now uses tokens and BEM naming
2. `src/components/blocks/shared/BlockSidebar.module.css` - Now uses tokens and BEM naming
3. `src/layouts/Canvas.module.css` - Now uses tokens and BEM naming
4. `src/layouts/sidebarTabs/BlocksTab.module.css` - Now uses tokens and BEM naming
5. `src/layouts/sidebarTabs/RowsTab.module.css` - Now uses tokens and BEM naming
6. `src/components/blocks/shared/SelectionCardActions.module.css` - Now uses tokens and BEM naming
7. `src/dnd/adapter/components/DropPlaceholder.module.css` - Now uses tokens and BEM naming
8. `src/dnd/adapter/components/DropIndicator.module.css` - Now uses tokens and BEM naming
9. `src/pages/Editor.module.css` - Now uses tokens and BEM naming

### Design Token Coverage
All CSS now uses:
- Color tokens: `var(--color-primary-500)`, `var(--text-primary)`, `var(--bg-elevated)`, etc.
- Spacing tokens: `var(--spacing-1)` through `var(--spacing-20)`
- Border tokens: `var(--border-width-1)`, `var(--radius-lg)`, etc.
- Shadow tokens: `var(--shadow-sm)`, `var(--shadow-md)`, etc.
- Transition tokens: `var(--transition-fast)`, `var(--transition-base)`, etc.

---

## Phase 2: Feature-Based Folder Structure (NEXT PHASE)

### Goals
1. Improve code organization and maintainability
2. Enhance developer experience with clear feature boundaries
3. Enable better code splitting and lazy loading
4. Maintain backward compatibility during migration

### Target Structure
```
src/
├── features/
│   ├── editor/
│   │   ├── components/
│   │   │   ├── Canvas/
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── Canvas.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Topbar/
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── Topbar.module.css
│   │   │   │   └── index.ts
│   │   │   └── Sidebar/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Sidebar.module.css
│   │   │       ├── tabs/
│   │   │       │   ├── BlocksTab.tsx
│   │   │       │   ├── BlocksTab.module.css
│   │   │       │   ├── RowsTab.tsx
│   │   │       │   └── RowsTab.module.css
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   └── useEditor.ts
│   │   ├── stores/
│   │   │   └── useCanvasStore.ts
│   │   └── index.ts
│   ├── blocks/
│   │   ├── components/
│   │   │   ├── TextBlock/
│   │   │   │   ├── TextBlock.tsx
│   │   │   │   ├── TextSidebar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ButtonBlock/
│   │   │   │   ├── ButtonBlock.tsx
│   │   │   │   ├── ButtonSidebar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── RowBlock/
│   │   │   │   ├── Row.tsx
│   │   │   │   ├── Column.tsx
│   │   │   │   ├── RowSidebar.tsx
│   │   │   │   ├── RowSidebar.module.css
│   │   │   │   └── index.ts
│   │   │   └── shared/
│   │   │       ├── Block.tsx
│   │   │       ├── BlockSidebar.tsx
│   │   │       ├── BlockSidebar.module.css
│   │   │       ├── SelectionCard.tsx
│   │   │       ├── SelectionCard.module.css
│   │   │       ├── SelectionCardActions.tsx
│   │   │       └── SelectionCardActions.module.css
│   │   ├── hooks/
│   │   │   ├── useBlock.tsx
│   │   │   └── useRow.tsx
│   │   ├── data/
│   │   │   ├── blocksCatalog.ts
│   │   │   └── rowsCatalog.ts
│   │   └── index.tsx
│   └── properties/
│       └── components/
│           └── PropertiesPanel/
│               ├── PropertiesPanel.tsx
│               ├── PropertiesPanel.module.css
│               └── index.ts
├── shared/
│   ├── components/
│   │   └── ui/
│   │       ├── Button/
│   │       │   ├── Button.tsx
│   │       │   ├── Button.module.css
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   └── utilities.css
│   └── hooks/
│       ├── useClickOutside.tsx
│       └── useSelectableElement.tsx
├── core/
│   ├── dnd/
│   │   ├── adapter/
│   │   │   ├── components/
│   │   │   │   ├── Draggable.tsx
│   │   │   │   ├── Droppable.tsx
│   │   │   │   ├── DragOverlay.tsx
│   │   │   │   ├── DropIndicator.tsx
│   │   │   │   ├── DropIndicator.module.css
│   │   │   │   ├── DropPlaceholder.tsx
│   │   │   │   └── DropPlaceholder.module.css
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   └── providers/
│   │   └── core/
│   ├── history/
│   │   ├── commands/
│   │   ├── services/
│   │   └── types/
│   └── richtext/
│       ├── adapter/
│       └── core/
├── entities/
│   └── template/
├── schema/
│   └── template/
├── pages/
│   ├── Editor/
│   │   ├── Editor.tsx
│   │   ├── Editor.module.css
│   │   └── index.ts
│   └── index.ts
├── theme/
│   ├── components/
│   ├── contexts/
│   └── providers/
├── assets/
│   └── icons/
├── utils/
└── App.tsx
```

### Migration Strategy: Strangler Fig Pattern

#### Step 1: Create Feature Directories (Week 1)
- Create new directory structure without moving files
- Set up index.ts barrel exports for each feature
- No breaking changes - old imports still work

```bash
# Create directories
mkdir -p src/features/editor/components/{Canvas,Topbar,Sidebar/tabs}
mkdir -p src/features/blocks/components/{TextBlock,ButtonBlock,RowBlock,shared}
mkdir -p src/features/properties/components/PropertiesPanel
mkdir -p src/shared/components/ui/Button
mkdir -p src/core/{dnd,history,richtext}
```

#### Step 2: Copy Files to New Structure (Week 2)
- Copy (don't move) files to new locations
- Update imports within copied files to use new paths
- Keep old files in place temporarily
- Add deprecation comments to old files

**Example:**
```typescript
// OLD: src/layouts/Canvas.tsx
/**
 * @deprecated This file has been moved to src/features/editor/components/Canvas
 * This file will be removed in the next major version.
 * Please update imports to: import { Canvas } from '@/features/editor/components/Canvas'
 */
export { Canvas } from '@/features/editor/components/Canvas';

// NEW: src/features/editor/components/Canvas/index.ts
export { Canvas } from './Canvas';
```

#### Step 3: Create Path Aliases (Week 2)
Update `tsconfig.json` with feature-based aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/core/*": ["./src/core/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/schema/*": ["./src/schema/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/theme/*": ["./src/theme/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

#### Step 4: Update Imports Gradually (Week 3-4)
- Use codemod or manual search-replace to update imports
- Update one feature at a time
- Test thoroughly after each feature migration
- Run tests continuously

**Example codemod:**
```bash
# Find all imports from old structure
rg "from '@/layouts/Canvas'" -l

# Replace with new structure
sed -i "s|from '@/layouts/Canvas'|from '@/features/editor/components/Canvas'|g"
```

#### Step 5: Remove Old Files (Week 5)
- After all imports updated and tests passing
- Remove deprecated files one by one
- Verify no references remain

#### Step 6: Documentation Update (Week 5)
- Update README with new architecture
- Create ARCHITECTURE.md explaining feature boundaries
- Update contributing guidelines

### Feature Boundaries

#### Editor Feature
**Responsibility:** Main editor layout, canvas rendering, toolbar
**Exports:**
- `Canvas` - Email template canvas
- `Topbar` - Editor toolbar with actions
- `Sidebar` - Collapsible sidebar with tabs
- `useCanvasStore` - Editor state management

#### Blocks Feature
**Responsibility:** All block types (text, button, row, etc.)
**Exports:**
- `TextBlock`, `ButtonBlock`, `RowBlock` - Block components
- `BlockSidebar`, `RowSidebar` - Sidebar representations
- `useBlock`, `useRow` - Block-specific hooks
- `BLOCKS_CATALOG`, `ROWS_CATALOG` - Available blocks

#### Properties Feature
**Responsibility:** Block/row properties editing panel
**Exports:**
- `PropertiesPanel` - Properties editor component

#### Core (Infrastructure)
**Responsibility:** Framework-level functionality
**Exports:**
- DND system
- History/undo system
- Rich text editor
- Low-level utilities

### Rollback Procedures

#### If Migration Causes Issues:
1. **Immediate rollback**: Revert to old imports via Git
2. **Partial rollback**: Keep new structure, add compatibility layer
3. **Feature flags**: Use environment variables to toggle between old/new structure

```typescript
// Compatibility layer example
import { Canvas as NewCanvas } from '@/features/editor/components/Canvas';
import { Canvas as OldCanvas } from '@/layouts/Canvas';

export const Canvas = process.env.USE_NEW_STRUCTURE === 'true'
  ? NewCanvas
  : OldCanvas;
```

### Testing Strategy

#### Before Migration:
- [ ] Ensure 100% test coverage for components being moved
- [ ] Document all current component behaviors
- [ ] Create integration tests for feature boundaries

#### During Migration:
- [ ] Run tests after each file move
- [ ] Verify build succeeds with no warnings
- [ ] Check bundle size doesn't increase significantly
- [ ] Manual smoke testing of all features

#### After Migration:
- [ ] Full regression testing
- [ ] Performance benchmarking
- [ ] Accessibility audit
- [ ] Cross-browser testing

### Risk Assessment

#### Low Risk ✅
- Creating new directories
- Adding path aliases
- Copying files to new locations
- Adding deprecation comments

#### Medium Risk ⚠️
- Updating imports (use automation)
- Removing old files (verify thoroughly)

#### High Risk 🚨
- None - This migration is incremental and reversible

### Success Metrics

- [ ] All components in feature-based folders
- [ ] Zero remaining files in old structure
- [ ] All imports use new paths
- [ ] Tests passing at 100%
- [ ] Build time improved or unchanged
- [ ] Bundle size unchanged or smaller
- [ ] Developer onboarding time reduced (survey team)

### Timeline

| Week | Tasks | Status |
|------|-------|--------|
| Week 1 | Create directory structure, set up barrel exports | Not Started |
| Week 2 | Copy files, add deprecation warnings, create aliases | Not Started |
| Week 3 | Update imports for editor feature | Not Started |
| Week 4 | Update imports for blocks & properties features | Not Started |
| Week 5 | Remove old files, update documentation | Not Started |
| Week 6 | Final testing, rollout | Not Started |

---

## Phase 3: Additional Improvements (Future)

### Code Splitting
- Implement lazy loading for feature modules
- Route-based code splitting
- Dynamic imports for heavy components

### Performance Optimization
- Memoization audit
- Virtual scrolling for large lists
- Web Workers for heavy computations

### Developer Experience
- Storybook setup for component development
- Better TypeScript types
- ESLint rules for import enforcement

---

## Notes

### Backward Compatibility
All changes maintain backward compatibility until Phase 2, Step 5. Old imports continue to work via re-exports.

### Breaking Changes
Breaking changes only occur when old files are removed in Phase 2, Step 5. This will be clearly communicated and scheduled.

### Communication
- Share this plan with team before starting
- Weekly status updates
- Demo new structure before removing old files

---

## Appendix: File Mapping

### Current → New Structure

| Current Path | New Path |
|-------------|----------|
| `src/layouts/Canvas.tsx` | `src/features/editor/components/Canvas/Canvas.tsx` |
| `src/layouts/Topbar.tsx` | `src/features/editor/components/Topbar/Topbar.tsx` |
| `src/layouts/Sidebar.tsx` | `src/features/editor/components/Sidebar/Sidebar.tsx` |
| `src/layouts/sidebarTabs/BlocksTab.tsx` | `src/features/editor/components/Sidebar/tabs/BlocksTab.tsx` |
| `src/layouts/sidebarTabs/RowsTab.tsx` | `src/features/editor/components/Sidebar/tabs/RowsTab.tsx` |
| `src/components/blocks/text/TextBlock.tsx` | `src/features/blocks/components/TextBlock/TextBlock.tsx` |
| `src/components/blocks/button/ButtonBlock.tsx` | `src/features/blocks/components/ButtonBlock/ButtonBlock.tsx` |
| `src/components/blocks/row/Row.tsx` | `src/features/blocks/components/RowBlock/Row.tsx` |
| `src/components/blocks/shared/Block.tsx` | `src/features/blocks/components/shared/Block.tsx` |
| `src/components/ui/Button/Button.tsx` | `src/shared/components/ui/Button/Button.tsx` |
| `src/dnd/*` | `src/core/dnd/*` |
| `src/history/*` | `src/core/history/*` |
| `src/richtext/*` | `src/core/richtext/*` |
| `src/stores/useCanvasStore.ts` | `src/features/editor/stores/useCanvasStore.ts` |
| `src/layouts/PropertiesPanel.tsx` | `src/features/properties/components/PropertiesPanel/PropertiesPanel.tsx` |

---

**Last Updated:** 2025-12-31
**Status:** Phase 1 Complete, Phase 2 Ready to Start
**Next Action:** Review with team, schedule Phase 2 kickoff
