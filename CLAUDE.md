# Guía de Desarrollo - Email Builder (Svelte 5)

## Svelte MCP Server - Herramientas Disponibles

### 1. list-sections
Descubre todas las secciones de documentación disponibles. Úsala PRIMERO cuando surjan preguntas sobre Svelte o SvelteKit.

### 2. get-documentation
Obtiene el contenido completo de secciones específicas. Después de list-sections, analiza los use_cases y obtén TODAS las secciones relevantes.

### 3. svelte-autofixer
Analiza código Svelte y devuelve problemas y sugerencias. DEBES usar esta herramienta al escribir código Svelte antes de enviarlo al usuario. Llámala hasta que no haya problemas.

### 4. playground-link
Genera un enlace al Svelte Playground. Pregunta al usuario primero si lo desea. NUNCA lo uses si el código fue escrito en archivos del proyecto.

---

## ⚡ Svelte 5 - Principios Fundamentales

### 🚫 NO USAR Código Legacy
Evita completamente estos patrones de Svelte 3/4:
- ❌ `let count = 0` (reactivo implícito)
- ❌ `$: doubled = count * 2` (reactive statements)
- ❌ `export let prop` (props con export)
- ❌ `on:click={handler}` (event handlers con on:)
- ❌ `<slot>` (usar snippets en su lugar)
- ❌ `$$props`, `$$restProps`

### ✅ USAR Runes (Svelte 5)

#### 1. **$state** - Estado Reactivo
```svelte
<script lang="ts">
  // Estado simple
  let count = $state(0);

  // Estado de objetos (deeply reactive)
  let user = $state({
    name: 'Juan',
    age: 30
  });

  // Estado de arrays
  let items = $state<string[]>([]);

  function increment() {
    count++; // Las mutaciones directas son reactivas
  }
</script>
```

#### 2. **$derived** - Valores Derivados
```svelte
<script lang="ts">
  let count = $state(0);

  // Valor derivado simple
  let doubled = $derived(count * 2);

  // Valor derivado complejo con $derived.by
  let expensiveCalculation = $derived.by(() => {
    // Cálculos complejos aquí
    return count * count * count;
  });
</script>
```

#### 3. **$effect** - Efectos Secundarios
```svelte
<script lang="ts">
  let count = $state(0);

  // Efecto simple
  $effect(() => {
    console.log('Count changed:', count);

    // Cleanup automático
    return () => {
      console.log('Cleanup');
    };
  });

  // Pre-effect (se ejecuta antes del DOM update)
  $effect.pre(() => {
    // Útil para medir el DOM antes de cambios
  });

  // Root effect (no se limpia automáticamente)
  $effect.root(() => {
    const interval = setInterval(() => {
      count++;
    }, 1000);

    return () => clearInterval(interval);
  });
</script>
```

#### 4. **$props** - Props de Componentes
```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number; // Opcional
    onClick?: () => void;
  }

  let { title, count = 0, onClick, ...rest }: Props = $props();
</script>

<div {...rest}>
  <h1>{title}</h1>
  <button onclick={onClick}>{count}</button>
</div>
```

#### 5. **$bindable** - Props Bindeables
```svelte
<!-- CustomInput.svelte -->
<script lang="ts">
  let { value = $bindable('') } = $props();
</script>

<input bind:value />

<!-- Uso -->
<script lang="ts">
  let text = $state('');
</script>

<CustomInput bind:value={text} />
```

#### 6. **Event Handlers** - Nueva Sintaxis
```svelte
<script lang="ts">
  function handleClick(event: MouseEvent) {
    console.log('Clicked!', event);
  }
</script>

<!-- Nueva sintaxis (sin 'on:') -->
<button onclick={handleClick}>Click me</button>

<!-- Con función inline -->
<button onclick={() => console.log('Clicked!')}>Click</button>

<!-- Múltiples handlers -->
<button
  onclick={handleClick}
  onmouseenter={() => console.log('Hover')}
>
  Button
</button>
```

---

## 🏗️ Arquitectura Escalable

### 1. Estructura de Carpetas
```
src/
├── lib/
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes UI básicos
│   │   └── features/    # Componentes de features
│   ├── state/           # Estado global (.svelte.ts)
│   ├── utils/           # Utilidades
│   ├── types/           # Tipos TypeScript
│   └── services/        # Lógica de negocio
├── routes/              # Páginas (SvelteKit)
└── app.html
```

### 2. Estado Compartido con .svelte.ts
```typescript
// src/lib/state/counter.svelte.ts
class Counter {
  count = $state(0);

  get doubled() {
    return $derived(this.count * 2);
  }

  increment() {
    this.count++;
  }

  reset() {
    this.count = 0;
  }
}

export const counter = new Counter();
```

```svelte
<!-- Uso en componentes -->
<script lang="ts">
  import { counter } from '$lib/state/counter.svelte';
</script>

<div>
  <p>Count: {counter.count}</p>
  <p>Doubled: {counter.doubled}</p>
  <button onclick={() => counter.increment()}>+</button>
</div>
```

### 3. Context API para Estado Local
```svelte
<!-- Provider.svelte -->
<script lang="ts">
  import { setContext } from 'svelte';

  interface ThemeContext {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  }

  let theme = $state<'light' | 'dark'>('light');

  setContext<ThemeContext>('theme', {
    get theme() { return theme; },
    toggleTheme: () => {
      theme = theme === 'light' ? 'dark' : 'light';
    }
  });
</script>

<slot />

<!-- Consumer.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';

  const { theme, toggleTheme } = getContext<ThemeContext>('theme');
</script>

<button onclick={toggleTheme}>
  Current: {theme}
</button>
```

### 4. Snippets para Composición
```svelte
<script lang="ts">
  interface Item {
    id: string;
    title: string;
  }

  let items = $state<Item[]>([
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' }
  ]);
</script>

<!-- Definir snippet -->
{#snippet itemTemplate(item: Item)}
  <div class="item">
    <h3>{item.title}</h3>
  </div>
{/snippet}

<!-- Usar snippet -->
{#each items as item (item.id)}
  {@render itemTemplate(item)}
{/each}

<!-- Pasar snippets como props -->
<List items={items} {itemTemplate} />
```

---

## 🎨 Mejores Prácticas de Estilos

### 1. Scoped Styles por Defecto
```svelte
<div class="container">
  <h1 class="title">Título</h1>
</div>

<style>
  /* Estilos automáticamente scoped al componente */
  .container {
    padding: 1rem;
  }

  .title {
    color: var(--primary-color);
  }
</style>
```

### 2. Custom Properties para Theming
```svelte
<!-- ThemeProvider.svelte -->
<div class="theme-root">
  <slot />
</div>

<style>
  .theme-root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --spacing-unit: 0.25rem;
  }
</style>

<!-- Component.svelte -->
<button class="btn">Click</button>

<style>
  .btn {
    background: var(--primary-color);
    padding: calc(var(--spacing-unit) * 4);
  }
</style>
```

### 3. Estilos Dinámicos con style:
```svelte
<script lang="ts">
  let color = $state('#ff0000');
  let size = $state(16);
</script>

<div
  style:color={color}
  style:font-size="{size}px"
  style:background-color="var(--bg-color)"
>
  Contenido
</div>
```

---

## 🧪 Testing

### 1. Configuración con Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

### 2. Testing de Componentes
```typescript
// Counter.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter', () => {
  it('increments count on button click', async () => {
    const { getByText } = render(Counter);
    const button = getByText('+');

    await fireEvent.click(button);

    expect(getByText('Count: 1')).toBeInTheDocument();
  });
});
```

---

## 🔒 TypeScript Best Practices

### 1. Tipado Estricto de Props
```svelte
<script lang="ts">
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface Props {
    user: User;
    onUpdate?: (user: User) => void;
    disabled?: boolean;
  }

  let { user, onUpdate, disabled = false }: Props = $props();
</script>
```

### 2. Tipos para Estado Complejo
```typescript
// types/template.ts
export interface NodeEntity {
  id: string;
  type: 'root' | 'row' | 'column' | 'text' | 'button';
  style?: CSSProperties;
}

export interface RowEntity extends NodeEntity {
  type: 'row';
  columns: ColumnEntity[];
}
```

### 3. Genéricos en Componentes
```svelte
<script lang="ts" generics="T">
  interface Props<T> {
    items: T[];
    renderItem: (item: T) => void;
  }

  let { items, renderItem }: Props<T> = $props();
</script>

{#each items as item}
  {renderItem(item)}
{/each}
```

---

## 🚀 Performance

### 1. Lazy Loading de Componentes
```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let HeavyComponent: any;

  onMount(async () => {
    const module = await import('./HeavyComponent.svelte');
    HeavyComponent = module.default;
  });
</script>

{#if HeavyComponent}
  <HeavyComponent />
{/if}
```

### 2. Memoización con $derived
```svelte
<script lang="ts">
  let items = $state<Item[]>([]);
  let filter = $state('');

  // Se recalcula solo cuando items o filter cambian
  let filteredItems = $derived(
    items.filter(item => item.name.includes(filter))
  );
</script>
```

---

## 📚 Recursos Oficiales

- **Documentación Oficial**: https://svelte.dev/docs/svelte/overview
- **Tutorial Interactivo**: https://svelte.dev/tutorial
- **Ejemplos**: https://svelte.dev/examples
- **Blog**: https://svelte.dev/blog

---

## ⚠️ Migrando de Svelte 4 a 5

Si encuentras código legacy, reemplázalo con los patrones equivalentes de Svelte 5:

| Legacy (Svelte 4) | Moderno (Svelte 5) |
|-------------------|-------------------|
| `let count = 0` | `let count = $state(0)` |
| `$: doubled = count * 2` | `let doubled = $derived(count * 2)` |
| `export let name` | `let { name } = $props()` |
| `on:click={handler}` | `onclick={handler}` |
| `<slot />` | `{@render children()}` |
| `<slot name="header" />` | `{#snippet header()}...{/snippet}` |
