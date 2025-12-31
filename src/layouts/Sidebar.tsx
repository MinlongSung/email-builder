import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Sidebar.module.css";
import { BlocksTab } from "@/layouts/sidebarTabs/BlocksTab";
import { RowsTab } from "@/layouts/sidebarTabs/RowsTab";

type Tab = "blocks" | "rows" | "settings";
const TABS: Tab[] = ["blocks", "rows", "settings"];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("blocks");
  const { t } = useTranslation();

  return (
    <aside
      className={styles.sidebar}
    >
      <div className={styles.tabsList}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabTrigger} ${
              activeTab === tab ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {activeTab === "blocks" && (
        <div className={styles.tabContent}>
          <BlocksTab />
        </div>
      )}

      {activeTab === "rows" && (
        <div className={styles.tabContent}>
          <RowsTab />
        </div>
      )}

      {activeTab === "settings" && (
        <div className={styles.tabContent}>
          <p>Settings content</p>
        </div>
      )}
    </aside>
  );
}
