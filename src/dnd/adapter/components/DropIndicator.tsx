import React from "react";

interface DropIndicatorProps {
  label?: string;
  className?: string;
}

export const DropIndicator: React.FC<DropIndicatorProps> = React.memo(
  ({ label, className = "" }) => {
    return (
      <div className={`${"dropIndicator"} ${className}`}>
        {label && <span className={"dropIndicator__label"}>{label}</span>}
      </div>
    );
  }
);
