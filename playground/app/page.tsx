"use client";

import "i18n-table/dist/index.css";
import TranslationManager from "i18n-table";

const TRANSLATIONS = {
  en: {
    test: "Test",
    colors: {
      red: "Red",
      blue: "Blue",
      green: "Green",
    },
  },
  es: {
    colors: {
      red: "Rojo",
      green: "Verde",
    },
  },
};

const LOCALES = [
  { locale: "en", fullName: "English", localName: "English" },
  { locale: "es", fullName: "Spanish", localName: "Español" },
];

export default function Page() {
  return (
    <TranslationManager
      locales={LOCALES}
      onSave={(translations) => {
        alert(JSON.stringify(translations, null, 2));
      }}
      translations={TRANSLATIONS}
    />
  );
}
