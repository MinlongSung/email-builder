import { CloneIcon, DeleteIcon, DragHandleIcon } from "@/assets/icons/Icons";

interface MoveActionProps {
  label: string;
}

export const MoveAction = ({ label }: MoveActionProps) => {
  return (
    <div
      className={"action"}
      data-drag-handle
      onClick={(e) => e.stopPropagation()}
      title={label}
    >
      <DragHandleIcon className={"action__icon"} />
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
      className={"action"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
    >
      <CloneIcon className={"action__icon"} />
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
      className={"action"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
    >
      <DeleteIcon className={"action__icon"} />
    </div>
  );
}
