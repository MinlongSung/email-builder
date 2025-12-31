import { useEffect, useRef } from "react";

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

export interface UseClickOutsideOptions {
  onDismiss: () => void;
  shouldDismiss: (event: MouseEvent) => boolean;
  enabled?: boolean;
}

/**
 * ============================================================================
 * Hook
 * ============================================================================
 */

export function useClickOutside(options: UseClickOutsideOptions): void {
  const { onDismiss, shouldDismiss, enabled = true } = options;

  const onDismissRef = useRef(onDismiss);
  const shouldDismissRef = useRef(shouldDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
    shouldDismissRef.current = shouldDismiss;
  }, [onDismiss, shouldDismiss]);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: PointerEvent) => {
      if (shouldDismissRef.current(event as MouseEvent)) {
        onDismissRef.current();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [enabled]);
}
