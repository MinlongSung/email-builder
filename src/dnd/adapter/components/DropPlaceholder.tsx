import React from "react";
import { PlaceholderArrow, PlaceholderCheck } from "@/assets/icons/DndIcons";
import styles from "@/dnd/adapter/components/DropPlaceholder.module.css";

interface DropPlaceholderProps {
  isOver: boolean;
  className?: string;
}

export const DropPlaceholder: React.FC<DropPlaceholderProps> = ({
  isOver,
  className = "",
}) => {
  return (
    <div
      className={`${styles.placeholder} ${
        isOver ? styles.isOver : ""
      } ${className}`}
      role="region"
      aria-label={
        isOver
          ? "Drop zone active - release to drop"
          : "Empty drop zone - drag items here"
      }
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          {isOver ? (
            <PlaceholderCheck strokeWidth={2.5} className={styles.icon} />
          ) : (
            <PlaceholderArrow className={styles.icon} />
          )}
        </div>
      </div>
    </div>
  );
};
