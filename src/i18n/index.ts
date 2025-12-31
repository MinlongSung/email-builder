import LanguageDetector from "i18next-browser-languagedetector";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import commonEnUs from "@/i18n/locales/en-US/common.json";
import commonEsEs from "@/i18n/locales/es-ES/common.json";

import notificationsEnUs from "@/i18n/locales/en-US/notifications.json";
import notificationsEsEs from "@/i18n/locales/es-ES/notifications.json";

import errorsEnUs from "@/i18n/locales/en-US/errors.json";
import errorsEsEs from "@/i18n/locales/es-ES/errors.json";

export const defaultNS = "common";
export const resources = {
  "en-US": {
    common: commonEnUs,
    notifications: notificationsEnUs,
    errors: errorsEnUs,
  },
  "es-ES": {
    common: commonEsEs,
    notifications: notificationsEsEs,
    errors: errorsEsEs,
  },
} as const;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    ns: ["common", "notifications", "errors"], // add if new json added
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
    },
  });

export default i18next;
