"use client";

import "i18n-table/dist/index.css";
import TranslationManager from "i18n-table";
import { LOCALES, TRANSLATIONS } from "./utils";

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
