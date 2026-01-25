import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpBackend)
  .init({
    lng: "en",
    fallbackLng: "en",
    ns: ["translation"],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18next;
