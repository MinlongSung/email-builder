import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BlocksTab } from "@/layouts/sidebarTabs/BlocksTab";
import { RowsTab } from "@/layouts/sidebarTabs/RowsTab";
import { SettingsTab } from "@/layouts/sidebarTabs/SettingsTab";

type Tab = "blocks" | "rows" | "settings";
const TABS: Tab[] = ["blocks", "rows", "settings"];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("blocks");
  const { t } = useTranslation();

  return (
    <aside className={"sidebar"}>
      <div className={"tabsList"}>
        {TABS.map((tab) => (
          <button
            key={tab}
            style={{ backgroundColor: activeTab === tab ? "blue" : "" }}
            onClick={() => setActiveTab(tab)}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {activeTab === "blocks" && (
        <div className={"tabContent"}>
          <BlocksTab />
        </div>
      )}

      {activeTab === "rows" && (
        <div className={"tabContent"}>
          <RowsTab />
        </div>
      )}

      {activeTab === "settings" && (
        <div className={"tabContent"}>
          <SettingsTab />
        </div>
      )}
    </aside>
  );
}
