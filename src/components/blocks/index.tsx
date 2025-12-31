import type { BlockEntity, RowEntity } from "@/entities/template";
import { TextBlock } from "@/components/blocks/text/TextBlock";
import { ButtonBlock } from "@/components/blocks/button/ButtonBlock";
import { Row } from "@/components/blocks/row/Row";

import { RowSidebar } from "@/components/blocks/row/RowSidebar";
import { TextSidebar } from "@/components/blocks/text/TextSidebar";
import { ButtonSidebar } from "@/components/blocks/button/ButtonSidebar";

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
    propertiesPanel: (entity) => {
      return <div>{"text"}</div>;
    },
  },
  button: {
    interactable: (entity) => <ButtonBlock block={entity} />,
    sidebar: () => <ButtonSidebar />,
    propertiesPanel: (entity) => {
      return <div>{"button"}</div>;
    },
  },
  row: {
    interactable: (entity) => <Row row={entity} />,
    sidebar: (entity) => <RowSidebar row={entity} />,
    propertiesPanel: (entity) => {
      return <div>{"row"}</div>;
    },
  },
};
