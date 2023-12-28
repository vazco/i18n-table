import get from "lodash.get";
import set from "lodash.set";

import { DataType, TranslationsType } from "../types";

export default function initData(
  keys: string[],
  locales: string[],
  translations: TranslationsType,
) {
  return keys.map((key) => {
    const object = {
      key,
      translations: {},
    } as Partial<DataType>;

    for (const locale of locales) {
      const value = get(translations[locale], key) as string | undefined;
      set(object.translations as DataType["translations"], locale, value ?? "");
    }

    return object;
  }) as DataType[];
}
