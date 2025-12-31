import React from "react";
import styles from "@/dnd/adapter/components/DropIndicator.module.css";

interface DropIndicatorProps {
  label?: string;
  className?: string;
}

export const DropIndicator: React.FC<DropIndicatorProps> = React.memo(({
  label,
  className = "",
}) => {
  return (
    <div
      className={`${styles.dropIndicator} ${className}`}
      role="separator"
      aria-label="Drop zone indicator"
    >
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
});
