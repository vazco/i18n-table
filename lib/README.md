<h1 align="center">i18n-table</h1>

<p align="center">
  <a href="https://github.com/vazco/i18n-table/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/vazco/i18n-table" alt="MIT license" />
  </a>
  <a href="https://vazco.eu">
    <img src="https://img.shields.io/badge/vazco-package-blue.svg" alt="Vazco">
  </a>
  <a href="https://npmjs.org/package/i18n-table">
    <img src="https://img.shields.io/npm/v/i18n-table.svg" alt="NPM version" />
  </a>
</p>

## Installation

```
npm install i18n-table
```

## Get started

1. Import `TranslationManager` and styles

```js
import TranslationManager from "i18n-table";
import "i18n-table/dist/index.css";
```

2. Prepare translations

```js
const translations = {
  en: {
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
```

`translations` object should have **locales** as keys and **objects or nested objects** as values.

3. Prepare locales with full and local names.

> [!IMPORTANT]
> The `locale` property have to match with locale used in the first step.

```js
const locales = [
  { locale: "en", fullName: "English", localName: "English" },
  { locale: "es", fullName: "Spanish", localName: "Español" },
];
```

4. Render `TranslationManager` on your page

```js
export const App = () => (
  <TranslationManager
    translations={translations}
    locales={locales}
    onSave={(translations) => {
      /* Handle saving translations - structure is the same as in the step 2. */
    }}
  />
);
```

5. If you want to write **your own styles**, copy `/src/lib/styles.css` file to your project, modify it and import it instead of `i18n-table/dist/index.css`

6. You can also customize header translations.

```js
const componentTranslations = {
  save: t("save"),
  search: t("search"),
  select: t("select"),
  translationKey: t("translationKey"),
};

export const App = () => (
  <TranslationManager
    // ...
    componentTranslations={componentTranslations}
    onLocaleChange={(locale) => i18n.setLocale(locale)}
  />
);
```

## License

**Like every package maintained by [Vazco](https://vazco.eu/), i18n-table package is [MIT licensed](https://github.com/vazco/i18n-table/blob/master/LICENSE).**
