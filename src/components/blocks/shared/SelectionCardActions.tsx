import {
  DragHandleIcon,
  CloneIcon,
  DeleteIcon,
} from "@/assets/icons/MenuIcons";

import styles from "./SelectionCardActions.module.css";

interface MoveActionProps {
  label: string;
}

export const MoveAction = ({ label }: MoveActionProps) => {
  return (
    <div
      className={styles.action}
      data-drag-handle
      onClick={(e) => e.stopPropagation()}
      title={label}
    >
      <DragHandleIcon className={styles.icon} />
    </div>
  );
};

interface CloneActionProps {
  label: string;
  onClick: () => void;
}

export function CloneAction({ label, onClick }: CloneActionProps) {
  return (
    <div
      className={styles.action}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
    >
      <CloneIcon className={styles.icon} />
    </div>
  );
}

interface DeleteActionProps {
  label: string;
  onClick: () => void;
}
export function DeleteAction({ label, onClick }: DeleteActionProps) {
  return (
    <div
      className={styles.action}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
    >
      <DeleteIcon className={styles.icon} />
    </div>
  );
}
