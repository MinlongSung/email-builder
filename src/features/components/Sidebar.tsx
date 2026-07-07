import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useScrollable } from "@/features/dnd/adapter/hooks/useScrollable";
import { ContentCatalog } from "@/features/components/ContentCatalog";
import { CONTENT_TEMPLATES } from "@/features/catalogs/content";
import { RowCatalog } from "@/features/components/RowCatalog";
import { ROW_TEMPLATES } from "@/features/catalogs//layout";

export function Sidebar() {
  const { setNodeRef } = useScrollable({ id: "sidebar" });
  return (
    <aside className="w-64 bg-white border-l border-gray-200 shrink-0 flex flex-col">
      <Tabs defaultValue="content">
        <TabsList defaultValue="content" className="w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="rows">Rows</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="overflow-y-auto" ref={setNodeRef}>
          <TabsContent value="content">
            <ContentCatalog templates={CONTENT_TEMPLATES}/>
          </TabsContent>
          <TabsContent value="rows">
            <RowCatalog templates={ROW_TEMPLATES} />
          </TabsContent>
          <TabsContent value="settings">Settings</TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
