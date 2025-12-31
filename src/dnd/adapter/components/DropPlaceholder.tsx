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
        isOver ? styles["placeholder--isOver"] : ""
      } ${className}`}
      role="region"
      aria-label={
        isOver
          ? "Drop zone active - release to drop"
          : "Empty drop zone - drag items here"
      }
    >
      <div className={styles.placeholder__content}>
        <div className={styles.placeholder__iconWrapper}>
          {isOver ? (
            <PlaceholderCheck strokeWidth={2.5} className={styles.placeholder__icon} />
          ) : (
            <PlaceholderArrow className={styles.placeholder__icon} />
          )}
        </div>
      </div>
    </div>
  );
};
