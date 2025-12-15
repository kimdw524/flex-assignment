import { useCallback, useMemo } from 'react';

import { useSearchParamsAdapter } from './useSearchParamsAdapter';

export type ParamValue =
  | string
  | number
  | boolean
  | (string | number | boolean)[];

interface UseSearchParamsReturn<P> {
  params: Readonly<P>;
  setParam: <K extends keyof P>(key: K, value: P[K]) => void;
  setParams: (param: Partial<P>) => void;
  getParam: <K extends keyof P>(key: K) => P[K];
}

export const useSearchParams = <
  Params extends {
    [K in keyof Params]: ParamValue;
  },
>(
  defaultValue: Params,
  validate: (params: Record<string, unknown>) => Params,
  delimiter?: string,
): UseSearchParamsReturn<Params> => {
  const { searchParams, setSearchParams } = useSearchParamsAdapter(delimiter);

  const params = useMemo(() => {
    try {
      return validate(searchParams);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('validation failed.', searchParams, error);
      }
      return defaultValue;
    }
  }, [searchParams, defaultValue, validate]);

  const setParam = useCallback(
    <K extends keyof Params>(key: K, value: Params[K]) => {
      setSearchParams({
        ...params,
        [key]: value,
      });
    },
    [params, setSearchParams],
  );

  const setParams = useCallback(
    (param: Partial<Params>) => {
      setSearchParams({
        ...params,
        ...param,
      });
    },
    [params, setSearchParams],
  );

  const getParam = useCallback(
    <K extends keyof Params>(key: K): Params[K] => params[key],
    [params],
  );

  return { params, setParam, setParams, getParam };
};
