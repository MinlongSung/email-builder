import { Fragment } from "react";
import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { ROW_TYPES } from "@/entities/template";
import type { Template } from "@/schema/template";
import { DropPlaceholder } from "@/dnd/adapter/components/DropPlaceholder";
import styles from "./Canvas.module.css";
import { Droppable } from "@/dnd/adapter/components/Droppable";

export const Canvas = ({ template }: { template: Template }) => {
  return (
    <main className={styles.canvas}> 
      {/* do not add element in between table, padding right disappears on top X scroll */}
      <Droppable id={template.id} accepts={ROW_TYPES}>
        {({ isOver, setNodeRef }) => (
          <table
            ref={setNodeRef}
            width={"100%"}
            className={styles.canvas__rootTemplate}
          >
            <tbody>
              <tr>
                <td>
                  {template.rows.length === 0 && (
                    <DropPlaceholder isOver={isOver} />
                  )}

                  {template.rows.map((row) => (
                    <Fragment key={row.id}>
                      {DRAGGABLES_REGISTRY[row.type].interactable(row)}
                    </Fragment>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Droppable>
    </main>
  );
};
