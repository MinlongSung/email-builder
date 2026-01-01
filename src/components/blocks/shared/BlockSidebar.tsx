import React from 'react';

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
      className={`${'blockCard'} ${className}`}
    >
      <div className={'blockCard__iconWrapper'}>
        {icon}
      </div>
      <span className={'blockCard__label'}>{label}</span>
    </div>
  );
};
