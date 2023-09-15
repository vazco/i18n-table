import get from 'lodash.get';
import set from 'lodash.set';
import React from 'react';

import Table from './Table';
import getSearchRegex from './lib/getSearchRegex';
import keyify from './lib/keyify';
import { Action, DataType, LocaleType, TranslationsType } from './types';

import './styles.css';

function initData(
  keys: string[],
  locales: LocaleType['locale'][],
  translations: Record<LocaleType['locale'], Record<string, unknown>>,
) {
  return keys.map(key => {
    const object = {
      key,
    } as Partial<DataType>;

    for (const locale of locales) {
      const value = get(translations[locale], key) as string | undefined;
      object[locale] = {
        action: Action.DEFAULT,
        value: value ?? '',
      };
    }

    return object;
  }) as DataType[];
}

function TranslationManager({
  translations,
  locales,
  onSave,
}: {
  translations: TranslationsType;
  locales: LocaleType[];
  onSave: (translations: TranslationsType) => void;
}) {
  const localeKeys = React.useMemo(() => {
    return locales.map(({ locale }) => locale);
  }, [locales]);

  const keys: string[] = React.useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(translations)
            .map(translation => keyify(translation))
            .flat(),
        ),
      ).sort(),
    [translations],
  );

  const [data, setData] = React.useState<DataType[]>(
    initData(keys, localeKeys, translations),
  );
  const [filteredData, setFilteredData] = React.useState(data);
  const [search, setSearch] = React.useState('');
  const [selectedLocale, setSelectedLocale] = React.useState('');
  const [isChanged, setIsChanged] = React.useState(false);

  React.useEffect(() => {
    if (search) {
      const filteredKeys = keys.filter(key => {
        if (search.includes('.')) {
          const regex = getSearchRegex(search);
          return regex.test(key);
        } else if (search.includes(' ')) {
          const searches = search.split(' ');
          return key
            .split('.')
            .some(key =>
              searches.some(search => getSearchRegex(search).test(key)),
            );
        }
        const regex = getSearchRegex(search);
        return key.split('.').some(key => regex.test(key));
      });

      if (filteredKeys.length) {
        setFilteredData(data.filter(({ key }) => filteredKeys.includes(key)));
      }
    } else {
      setFilteredData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSave = () => {
    const dataCopy = JSON.parse(JSON.stringify(data)) as DataType[];

    const translations: Record<
      LocaleType['locale'],
      Record<string, unknown>
    > = {};
    for (const localeKey of localeKeys) {
      translations[localeKey] = {};
      for (const translation of dataCopy) {
        set(
          translations[localeKey],
          translation.key,
          (translation[localeKey] as { action: Action; value: string }).value,
        );
        set(
          dataCopy[dataCopy.findIndex(({ key }) => key === translation.key)],
          `${localeKey}.action`,
          Action.DEFAULT,
        );
      }
    }

    setIsChanged(false);
    setData(dataCopy);

    onSave(translations);
  };

  let sortedLocales = [...localeKeys];
  if (selectedLocale) {
    const index = sortedLocales.indexOf(selectedLocale);
    sortedLocales.splice(index, 1);
    sortedLocales = [selectedLocale, ...sortedLocales];
  }

  return (
    <div className="translation-manager">
      <div className="header">
        <input
          className="search"
          onChange={event => setSearch(event.target.value)}
          placeholder="Search"
          type="text"
          value={search}
        />

        <select
          className="locale-dropdown"
          onChange={event => setSelectedLocale(event.target.value)}
          value={selectedLocale}
        >
          <option value="">Select locale</option>
          {sortedLocales.map(locale => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>

        {isChanged && (
          <button className="save" onClick={handleSave}>
            Save
          </button>
        )}
      </div>

      <Table
        data={data}
        filteredData={filteredData}
        isChanged={isChanged}
        locales={locales}
        selectedLocale={selectedLocale}
        setData={setData}
        setIsChanged={setIsChanged}
        sortedLocales={sortedLocales}
        translations={translations}
      />
    </div>
  );
}

export default TranslationManager;
