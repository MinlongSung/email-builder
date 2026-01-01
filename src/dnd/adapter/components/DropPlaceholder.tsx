import React from "react";

interface DropPlaceholderProps {
  isOver: boolean;
  className?: string;
}

export const DropPlaceholder: React.FC<DropPlaceholderProps> = ({
  isOver,
  className = "",
}) => {
  return (
    <div className={`${'placeholder'} ${className}`}>
      {isOver ? "Dropping" : "Drop Here"}
    </div>
  );
};
