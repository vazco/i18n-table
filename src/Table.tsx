import FileSaver from 'file-saver';
import yaml from 'js-yaml';
import get from 'lodash.get';
import set from 'lodash.set';
import React from 'react';
import { TableVirtuoso } from 'react-virtuoso';

import { Action, DataType, LocaleType } from './types';

type TableProps = {
  data: DataType[];
  filteredData: DataType[];
  isChanged: boolean;
  locales: LocaleType[];
  selectedLocale: LocaleType['locale'];
  setData: React.Dispatch<React.SetStateAction<DataType[]>>;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  sortedLocales: LocaleType['locale'][];
  translations: Record<LocaleType['locale'], Record<string, unknown>>;
};

function Table({
  data,
  filteredData,
  isChanged,
  locales,
  selectedLocale,
  setData,
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

    setData(data => {
      const dataCopy = JSON.parse(JSON.stringify(data)) as DataType[];
      const localeIndex = dataCopy.findIndex(data => data.key === key);

      const previousValue = get(translations[locale], key) ?? '';

      if (previousValue === value) {
        set(dataCopy[localeIndex], locale, { action: Action.DEFAULT, value });
      } else if (value === '') {
        set(dataCopy[localeIndex], locale, { action: Action.REMOVED, value });
      } else if (previousValue === '' && value !== '') {
        set(dataCopy[localeIndex], locale, { action: Action.ADDED, value });
      } else if (previousValue !== value) {
        set(dataCopy[localeIndex], locale, { action: Action.MODIFIED, value });
      } else {
        set(dataCopy[localeIndex], `${locale}.value`, value);
      }

      return dataCopy;
    });
  };

  const handleExportFile = (locale: string, type: 'json' | 'yml') => {
    const currentData = JSON.parse(JSON.stringify(data)) as DataType[];
    const dataObject = {};

    for (const translation of currentData) {
      set(dataObject, translation.key, translation[locale].value);
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
      className="table"
      data={filteredData}
      fixedHeaderContent={() => (
        <tr>
          <th className="top-layer">Translation key</th>
          {sortedLocales.map((localeKey, index) => {
            const currentLocale = locales.find(
              ({ locale }) => locale === localeKey,
            );

            const width = `max(300px, calc((100vw - 240px) / ${sortedLocales.length}))`;

            return (
              <th
                className={selectedLocale && index === 0 ? 'sticky-column' : ''}
                key={currentLocale.fullName}
                style={{ minWidth: width, width }}
              >
                <span className="locale-names">
                  {currentLocale.fullName} | {currentLocale.localName}
                </span>
                <div className="export-group">
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
          <td className="translation-key">{item.key}</td>
          {sortedLocales.map((locale, index) => {
            const isSticky = selectedLocale && index === 0;

            return (
              <td
                key={locale + '-' + item.key}
                className={
                  isSticky
                    ? `translation sticky-column${
                        item[locale].action === Action.DEFAULT
                          ? ' translation-background'
                          : ''
                      } ${item[locale].action}`
                    : `translation ${item[locale].action}`
                }
              >
                <textarea
                  value={item[locale].value}
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
