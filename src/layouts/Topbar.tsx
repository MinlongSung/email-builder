import { useTranslation } from "react-i18next";
import {
  MonitorIcon,
  SmartphoneIcon,
  EyeIcon,
  DownloadIcon,
  SaveIcon,
  EmailIcon,
} from "@/assets/icons/TopbarIcons";
import { ThemeToggle } from "@/theme/components/ThemeToggle";
import styles from "@/layouts/Topbar.module.css";
import { useUIStore } from "@/stores/useUIStore";
import { resources } from "@/i18n";

const LANGUAGES = Object.keys(resources);

export function Topbar() {
  const viewMode = useUIStore((store) => store.viewMode);
  const setViewMode = useUIStore((store) => store.setViewMode);
  const { i18n } = useTranslation();

  return (
    <header className={styles.topbar} data-no-dismiss role="banner">
      {/* Left: Logo + Title */}
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <EmailIcon size={20} strokeWidth={2.5} className={styles.logoIcon} />
        </div>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Email Template Editor</h1>
        </div>
      </div>

      {/* Center: View Mode Toggle */}
      <div className={styles.centerSection}>
        <button
          onClick={() => setViewMode("desktop")}
          className={`${styles.viewButton} ${
            viewMode === "desktop" ? styles.active : ""
          }`}
          title="Desktop View"
          aria-pressed={viewMode === "desktop"}
        >
          <MonitorIcon size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`${styles.viewButton} ${
            viewMode === "mobile" ? styles.active : ""
          }`}
          title="Mobile View"
          aria-pressed={viewMode === "mobile"}
        >
          <SmartphoneIcon size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Right: Actions */}
      <div className={styles.rightSection}>
        {/* Dark Mode Toggle */}
        <ThemeToggle />

        {/* Language Selector */}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className={styles.languageSelect}
        >
          {LANGUAGES.map((lng) => (
            <option value={lng} key={lng}>
              {lng}
            </option>
          ))}
        </select>

        {/* Preview */}
        <button className={styles.actionButton} title="Preview email">
          <EyeIcon size={16} strokeWidth={2.5} />
          <span>Preview</span>
        </button>

        {/* Export */}
        <button className={styles.actionButton} title="Export template">
          <DownloadIcon size={16} strokeWidth={2.5} />
          <span>Export</span>
        </button>

        {/* Save */}
        <button className={styles.saveButton} title="Save template">
          <SaveIcon size={16} strokeWidth={2.5} />
          <span>Save</span>
        </button>
      </div>
    </header>
  );
}
