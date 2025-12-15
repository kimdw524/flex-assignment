/**
 * object를 queryString으로 직렬화하는 함수
 */
export const serializeQueryString = <
  T extends {
    [K in keyof T]:
      | string
      | number
      | boolean
      | (string | number | boolean)[]
      | undefined;
  },
>(
  params: T,
  delimiter?: string,
): string => {
  const result: string[] = [];

  for (const key in params) {
    const value = params[key];

    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      if (delimiter === undefined) {
        for (const item of value) {
          result.push(`${key}=${item}`);
        }
        continue;
      }

      result.push(`${key}=${value.join(delimiter)}`);
      continue;
    }

    result.push(`${key}=${encodeURIComponent(value)}`);
  }

  return result.join('&');
};

/**
 * queryString을 object로 변환하는 함수
 */
export function parseQueryString(
  query: string,
  delimiter?: string,
): Record<string, string | string[]> {
  const params = new URLSearchParams(query);
  const result: Record<string, string | string[]> = {};

  for (const key of params.keys()) {
    const values = params.getAll(key);
    if (delimiter === undefined) {
      result[key] = values.length > 1 ? values : values[0]!;
      continue;
    }

    const splitted = values[0]!.split(delimiter)!;
    result[key] = splitted.length > 1 ? splitted : splitted[0]!;
  }

  return result;
}
