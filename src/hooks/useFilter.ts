import { useCallback, useMemo, useRef, useState } from 'react';

import { resolveLazy, type Lazy } from '@/utils/lazy';

export type FilterValue =
  | string
  | number
  | boolean
  | (string | number | boolean)[];

interface UseFilterReturn<Filters extends Record<string, FilterValue>> {
  filters: Readonly<Filters>;
  getFilter: <K extends keyof Filters>(key: K) => Filters[K];
  setFilter: (filter: Partial<Filters>) => boolean;
  checkFilter: (filter: Partial<Filters>) => boolean;
}

const useFilter = (defaultValue, initialValue): {setParam, getParam, params, reset} => {

}

export const useFilter = <Filters extends Record<string, FilterValue>>(
  defaultValue: Lazy<Filters>,
  initialValue: Lazy<Filters>,
  validate: (filter: Filters) => Filters,
): UseFilterReturn<Filters> => {
  const [filters, setFilters] = useState<Filters>(() => {
    try {
      return validate(resolveLazy(initialValue));
    } catch {
      return resolveLazy(defaultValue);
    }
  });
  const validateRef = useRef(validate);

  const getFilter = useCallback(
    <K extends keyof Filters>(key: K): Filters[K] => filters[key],
    [filters],
  );

  const setFilter = useCallback(
    (filter: Partial<Filters>): boolean => {
      try {
        const validatedFilters = validateRef.current({
          ...filters,
          ...filter,
        });

        setFilters(validatedFilters);
        return true;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('validation failed.', { ...filters, ...filter }, error);
        }
        return false;
      }
    },
    [filters],
  );

  const checkFilter = useCallback(
    (filter: Partial<Filters>): boolean => {
      try {
        void validateRef.current({
          ...filters,
          ...filter,
        });
        return true;
      } catch {
        return false;
      }
    },
    [filters],
  );

  return useMemo(
    () => ({
      filters,
      getFilter,
      setFilter,
      checkFilter,
    }),
    [filters, getFilter, setFilter, checkFilter],
  );
};
