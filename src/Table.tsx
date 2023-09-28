import FileSaver from 'file-saver';
import yaml from 'js-yaml';
import get from 'lodash.get';
import set from 'lodash.set';
import React from 'react';
import { TableVirtuoso } from 'react-virtuoso';

import buildClassName from './lib/buildClassName';
import { DEFAULT_COMPONENT_TRANSLATIONS } from './lib/constants';
import { Action, ChangesType, DataType, LocaleType } from './types';

type TableProps = {
  changes: ChangesType;
  componentTranslations: typeof DEFAULT_COMPONENT_TRANSLATIONS;
  data: DataType[];
  filteredData: DataType[];
  isChanged: boolean;
  locales: LocaleType[];
  selectedLocale: string;
  setChanges: React.Dispatch<React.SetStateAction<ChangesType>>;
  setData: React.Dispatch<React.SetStateAction<DataType[]>>;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  sortedLocales: string[];
  translations: Record<string, Record<string, unknown>>;
};

function Table({
  changes,
  componentTranslations,
  data,
  filteredData,
  isChanged,
  locales,
  selectedLocale,
  setChanges,
  setIsChanged,
  sortedLocales,
  translations,
}: TableProps) {
  const handleTranslationChange = (
    key: string,
    locale: string,
    value: string,
  ) => {
    if (!isChanged) {
      setIsChanged(true);
    }

    setChanges(changes => {
      const changesCopy = JSON.parse(JSON.stringify(changes)) as typeof changes;
      const translationKey = data.find(data => data.key === key).key;

      const previousValue = get(translations[locale], key) ?? '';

      if (!changesCopy[translationKey]) {
        changesCopy[translationKey] = {};
      }

      if (previousValue === value) {
        delete changesCopy[translationKey][locale];
      } else if (value === '') {
        set(changesCopy[translationKey], locale, {
          action: Action.REMOVED,
          value,
        });
      } else if (previousValue === '' && value !== '') {
        set(changesCopy[translationKey], locale, {
          action: Action.ADDED,
          value,
        });
      } else if (previousValue !== value) {
        set(changesCopy[translationKey], locale, {
          action: Action.MODIFIED,
          value,
        });
      } else {
        set(changesCopy, `${translationKey}.${locale}.value`, value);
      }

      return changesCopy;
    });
  };

  const handleExportFile = (locale: string, type: 'json' | 'yml') => {
    const currentData = JSON.parse(JSON.stringify(data)) as typeof data;
    const dataObject = {};

    for (const translation of currentData) {
      const value =
        changes[translation.key]?.[locale]?.value ??
        translation.translations[locale];
      set(dataObject, translation.key, value);
    }

    const serializedTranslations =
      type === 'json'
        ? JSON.stringify(dataObject, null, 2)
        : yaml.dump(dataObject, { sortKeys: true });

    const file = new File([serializedTranslations], `${locale}.${type}`, {
      type: 'text/plain;charset=utf-8',
    });

    FileSaver.saveAs(file);
  };

  return (
    <TableVirtuoso
      className={buildClassName('table')}
      data={filteredData}
      fixedHeaderContent={() => (
        <tr>
          <th className={buildClassName('top-layer')}>
            {componentTranslations.translationKey}
          </th>
          {sortedLocales.map((localeKey, index) => {
            const currentLocale = locales.find(
              ({ locale }) => locale === localeKey,
            );

            const width = `max(300px, calc((100vw - 240px) / ${sortedLocales.length}))`;

            return (
              <th
                className={
                  selectedLocale && index === 0
                    ? buildClassName('sticky-column')
                    : ''
                }
                key={currentLocale.fullName}
                style={{ minWidth: width, width }}
              >
                <span className={buildClassName('locale-names')}>
                  {currentLocale.fullName} | {currentLocale.localName}
                </span>
                <div className={buildClassName('export-group')}>
                  <button
                    onClick={() =>
                      handleExportFile(currentLocale.locale, 'json')
                    }
                  >
                    JSON
                  </button>
                  <button
                    onClick={() =>
                      handleExportFile(currentLocale.locale, 'yml')
                    }
                  >
                    YML&ensp;
                  </button>
                </div>
              </th>
            );
          })}
        </tr>
      )}
      itemContent={(_index, item) => (
        <>
          <td className={buildClassName('translation-key')}>{item.key}</td>
          {sortedLocales.map((locale, index) => {
            const isSticky = selectedLocale && index === 0;

            return (
              <td
                key={locale + '-' + item.key}
                className={buildClassName(
                  isSticky
                    ? `translation sticky-column${
                        changes[item.key]?.[locale]?.action
                          ? ''
                          : ' translation-background'
                      } ${changes[item.key]?.[locale]?.action}`
                    : `translation ${changes[item.key]?.[locale]?.action}`,
                )}
              >
                <textarea
                  value={
                    changes[item.key]?.[locale]?.value ??
                    item.translations[locale]
                  }
                  onChange={event =>
                    handleTranslationChange(
                      item.key,
                      locale,
                      event.target.value,
                    )
                  }
                />
              </td>
            );
          })}
        </>
      )}
    />
  );
}

export default Table;
