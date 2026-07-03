import type { EmailTemplate } from "@/features/models/types";
import { generateId } from "@/features/utils/generateId";

export const generateDefaultTemplate = (): EmailTemplate => {
  const rootId = generateId();

  return {
    document: {
      rootIds: [rootId],

      blocks: {
        [rootId]: {
          id: rootId,
          type: "root",
          parentId: null,
          childrenIds: [],
          props: {
            width: "600px",
          },
        },
      },
    },
  };
};
