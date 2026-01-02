import type { BlockEntity, RowEntity } from "@/entities/template";
import { TextBlock } from "@/components/blocks/text/TextBlock";
import { ButtonBlock } from "@/components/blocks/button/ButtonBlock";
import { Row } from "@/components/blocks/row/Row";

import { RowSidebar } from "@/components/blocks/row/RowSidebar";
import { TextSidebar } from "@/components/blocks/text/TextSidebar";
import { ButtonSidebar } from "@/components/blocks/button/ButtonSidebar";
import { TextPanel } from "@/components/blocks/text/TextPanel";
import { RowPanel } from "@/components/blocks/row/RowPanel";

export type Draggable = BlockEntity | RowEntity;

export type DraggablesRenderer<T> = {
  interactable: (entity: T) => React.ReactNode;
  sidebar: (entity: T) => React.ReactNode;
  propertiesPanel: (entity: T) => React.ReactNode;
};

export const DRAGGABLES_REGISTRY: {
  [K in Draggable["type"]]: DraggablesRenderer<Extract<Draggable, { type: K }>>;
} = {
  text: {
    interactable: (entity) => <TextBlock block={entity} />,
    sidebar: () => <TextSidebar />,
    propertiesPanel: (entity) => <TextPanel block={entity} />,
  },
  button: {
    interactable: (entity) => <ButtonBlock block={entity} />,
    sidebar: () => <ButtonSidebar />,
    propertiesPanel: (_entity) => {
      return <div>{"button"}</div>;
    },
  },
  row: {
    interactable: (entity) => <Row row={entity} />,
    sidebar: (entity) => <RowSidebar row={entity} />,
    propertiesPanel: (entity) => <RowPanel row={entity}/>,
  },
};
