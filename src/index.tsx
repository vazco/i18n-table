import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import React, { useEffect, useMemo, useState } from 'react';

import Table from './Table';
import buildClassName from './lib/buildClassName';
import { DEFAULT_COMPONENT_TRANSLATIONS } from './lib/constants';
import getSearchRegex from './lib/getSearchRegex';
import keyify from './lib/keyify';
import { ChangesType, DataType, LocaleType, TranslationsType } from './types';

import './styles.css';

function initData(
  keys: string[],
  locales: string[],
  translations: TranslationsType,
) {
  return keys.map(key => {
    const object = {
      key,
      translations: {},
    } as Partial<DataType>;

    for (const locale of locales) {
      const value = get(translations[locale], key) as string | undefined;
      set(object.translations as DataType['translations'], locale, value ?? '');
    }

    return object;
  }) as DataType[];
}

type TranslationManagerProps = {
  componentTranslations: typeof DEFAULT_COMPONENT_TRANSLATIONS;
  locales: LocaleType[];
  onLocaleChange: (locale: string) => void;
  onSave: (translations: TranslationsType) => void;
  translations: TranslationsType;
};

function TranslationManager({
  componentTranslations = DEFAULT_COMPONENT_TRANSLATIONS,
  locales,
  onLocaleChange,
  onSave,
  translations,
}: TranslationManagerProps) {
  const localeKeys = useMemo(() => {
    return locales.map(({ locale }) => locale);
  }, [locales]);

  const keys: string[] = useMemo(
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

  const [changes, setChanges] = useState<ChangesType>({});
  const [data, setData] = useState(initData(keys, localeKeys, translations));
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState('');
  const [selectedLocale, setSelectedLocale] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSave = () => {
    const dataCopy = cloneDeep(data);

    const translations: TranslationsType = {};
    for (const localeKey of localeKeys) {
      translations[localeKey] = {};
      for (const translation of dataCopy) {
        const value =
          changes[translation.key]?.[localeKey]?.value ??
          translation.translations[localeKey];

        set(translations[localeKey], translation.key, value);
        set(
          dataCopy[dataCopy.findIndex(({ key }) => key === translation.key)]
            .translations,
          localeKey,
          value,
        );
      }
    }

    setIsChanged(false);
    setData(dataCopy);
    setChanges({});

    onSave(translations);
  };

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = event.target.value;
    setSelectedLocale(locale);
    onLocaleChange(locale);
  };

  let sortedLocales = [...localeKeys];
  if (selectedLocale) {
    const index = sortedLocales.indexOf(selectedLocale);
    sortedLocales.splice(index, 1);
    sortedLocales = [selectedLocale, ...sortedLocales];
  }

  return (
    <div className={buildClassName('translation-manager')}>
      <div className={buildClassName('header')}>
        <input
          className={buildClassName('search')}
          onChange={event => setSearch(event.target.value)}
          placeholder={componentTranslations.search}
          type="text"
          value={search}
        />

        <select
          className={buildClassName('locale-dropdown')}
          onChange={handleLocaleChange}
          value={selectedLocale}
        >
          <option value="">{componentTranslations.select}</option>
          {sortedLocales.map(locale => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>

        {isChanged && (
          <button className={buildClassName('save')} onClick={handleSave}>
            {componentTranslations.save}
          </button>
        )}
      </div>

      <Table
        changes={changes}
        componentTranslations={componentTranslations}
        data={data}
        filteredData={filteredData}
        isChanged={isChanged}
        locales={locales}
        selectedLocale={selectedLocale}
        setChanges={setChanges}
        setData={setData}
        setIsChanged={setIsChanged}
        sortedLocales={sortedLocales}
        translations={translations}
      />
    </div>
  );
}

export default TranslationManager;
