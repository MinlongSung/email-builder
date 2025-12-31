import React from "react";
import type { RowEntity } from "@/entities/template";
import styles from "./RowSidebar.module.css";

interface RowSidebarProps {
  row: RowEntity;
  className?: string;
  style?: React.CSSProperties;
}

export const RowSidebar: React.FC<RowSidebarProps> = ({
  row,
  style = {},
  className = "",
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Draggable ${row.columns.length}-column row`}
      style={{ ...style }}
      className={`${styles.rowCard} ${className}`}
    >
      <div className={styles.preview}>
        <div className={styles.columnPreview}>
          {row.columns.map((column, idx) => (
            <div
              key={idx}
              className={styles.column}
              style={{ flex: column.width }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
