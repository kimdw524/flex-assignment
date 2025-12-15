export type Lazy<T> = T | (() => T);

export const resolveLazy = <T>(value: Lazy<T>): T => {
  return typeof value === 'function' ? (value as () => T)() : value;
};
