import React from 'react';
import styles from './BlockSidebar.module.css';

interface BlockSidebarProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BlockSidebar: React.FC<BlockSidebarProps> = ({
  icon,
  label,
  className = '',
  style = {},
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Draggable ${label} block`}
      style={{ ...style }}
      className={`${styles.blockCard} ${className}`}
    >
      <div className={styles.blockCard__iconWrapper}>
        {icon}
      </div>
      <span className={styles.blockCard__label}>{label}</span>
    </div>
  );
};
