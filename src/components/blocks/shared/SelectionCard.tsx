import { forwardRef, Fragment, useState } from "react";
import styles from "./SelectionCard.module.css";
import { useSelectableElement } from "@/hooks/useSelectableElement";
import { DotsVerticalIcon } from "@/assets/icons/MenuIcons";

interface SelectionCardProps {
  id: string;
  label: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  className?: string;
}

export const SelectionCard = forwardRef<HTMLDivElement, SelectionCardProps>(
  ({ id, label, children, actions = [], className = "" }, ref) => {
    const { isHighlighted, isHovered, handlers } = useSelectableElement(id);

    return (
      <div
        ref={ref}
        data-no-dismiss
        {...handlers}
        className={`${styles.selectionCard} ${
          isHighlighted ? styles.highlight : ""
        } ${className}`}
      >
        {isHighlighted && <div className={styles.badge}>{label}</div>}

        {children}

        <SelectionCardMenu actions={actions} isVisible={isHovered} />
      </div>
    );
  }
);

export const SelectionCardMenu: React.FC<{
  actions: React.ReactNode[];
  isVisible: boolean;
}> = ({ actions, isVisible }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${styles.selectionCardMainMenu} ${
        isVisible ? "" : styles.hidden // hide instead of unmount since it cancels drag touch event
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className={styles.mainMenuButton}>
        <DotsVerticalIcon className={styles.mainMenuButtonIcon} />
      </div>

      <div className={`${styles.menuActions} ${open ? "" : styles.hidden}`}>
        {actions.map((action, i) => (
          <Fragment key={i}>{action}</Fragment>
        ))}
      </div>
    </div>
  );
};
