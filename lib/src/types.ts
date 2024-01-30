export enum Action {
  ADDED = "added",
  MODIFIED = "modified",
  REMOVED = "removed",
}

export type LocaleType = {
  locale: string;
  fullName: string;
  localName: string;
};

export type DataType = {
  key: string;
  translations: {
    [locale: string]: string;
  };
};

export type ChangesType = Record<
  string,
  {
    [locale: string]: {
      action: Action;
      value: string;
    };
  }
>;

export type TranslationsType = Record<string, Record<string, unknown>>;
