import { useCallback, useEffect, useState } from 'react';

import { parseQueryString, serializeQueryString } from '@/utils/queryString';

import type { ParamValue } from './useSearchParams';

interface SearchParamsAdapter {
  searchParams: Record<string, string | string[]>;
  setSearchParams: (searchParams: Record<string, ParamValue>) => void;
}

export const useSearchParamsAdapter = (
  delimier?: string,
): SearchParamsAdapter => {
  const [searchParams, setSearchParams] = useState<
    Record<string, string | string[]>
  >(() =>
    parseQueryString(window.location.search.replace(/^\?/, ''), delimier),
  );

  const updateSearchParams = useCallback(
    (value: Record<string, ParamValue>) => {
      window.history.pushState(
        {},
        '',
        `${window.location.pathname}?${serializeQueryString(value, delimier)}`,
      );

      setSearchParams(
        parseQueryString(window.location.search.replace(/^\?/, ''), delimier),
      );
    },
    [delimier],
  );

  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(
        parseQueryString(window.location.search.replace(/^\?/, ''), delimier),
      );
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [delimier]);

  return {
    searchParams,
    setSearchParams: updateSearchParams,
  };
};
