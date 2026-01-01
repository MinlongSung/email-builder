import { useTranslation } from "react-i18next";
import { useUIStore } from "@/stores/useUIStore";
import { resources } from "@/i18n";

const LANGUAGES = Object.keys(resources);

export function Topbar() {
  const viewMode = useUIStore((store) => store.viewMode);
  const setViewMode = useUIStore((store) => store.setViewMode);
  const { i18n } = useTranslation();

  return (
    <header className={"topbar"} data-no-dismiss role="banner">
      {/* Center: View Mode Toggle */}
      <div style={{ display: "flex" }}>
        <button
          onClick={() => setViewMode("desktop")}
          style={{
            backgroundColor: viewMode === "desktop" ? "red" : "",
          }}
        >
          Desktop
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          style={{
            backgroundColor: viewMode === "mobile" ? "red" : "",
          }}
        >
          Mobile
        </button>
      </div>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {LANGUAGES.map((lng) => (
          <option value={lng} key={lng}>
            {lng}
          </option>
        ))}
      </select>
    </header>
  );
}
