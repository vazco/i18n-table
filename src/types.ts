export enum Action {
  DEFAULT = 'default',
  ADDED = 'added',
  MODIFIED = 'modified',
  REMOVED = 'removed',
}

export type LocaleType = {
  locale: string;
  fullName: string;
  localName: string;
};

export type DataType = { key: string } & {
  [locale: LocaleType['locale']]: {
    action: Action;
    value: string;
  };
};

export type TranslationsType = Record<
  LocaleType['locale'],
  Record<string, unknown>
>;
