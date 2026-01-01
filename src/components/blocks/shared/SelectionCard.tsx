import { forwardRef, Fragment, useState } from "react";
import { useSelectableElement } from "@/hooks/useSelectableElement";
import { DotsVerticalIcon } from "@/assets/icons/Icons";

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
        className={`${'selectionCard'} ${
          isHighlighted ? 'highlight' : ""
        } ${className}`}
      >
        {isHighlighted && <div className={'badge'}>{label}</div>}

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
      className={`${'selectionCardMainMenu'} ${
        isVisible ? "" : 'hidden' // hide instead of unmount since it cancels drag touch event
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className={'mainMenuButton'}>
        <DotsVerticalIcon className={'mainMenuButtonIcon'} />
      </div>

      <div className={`${'menuActions'} ${open ? "" : 'hidden'}`}>
        {actions.map((action, i) => (
          <Fragment key={i}>{action}</Fragment>
        ))}
      </div>
    </div>
  );
};
