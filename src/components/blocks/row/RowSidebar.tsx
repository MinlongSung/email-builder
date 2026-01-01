import React from "react";
import type { RowEntity } from "@/entities/template";

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
      className={`${'rowCard'} ${className}`}
    >
      {row.columns.map((column, idx) => (
        <div
          key={idx}
          className={'rowCard__column'}
          style={{ flex: column.width }}
        />
      ))}
    </div>
  );
};
