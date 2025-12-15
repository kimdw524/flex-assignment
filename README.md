# flex-assignment

## 소개

<img width="893" height="253" alt="image" src="https://github.com/user-attachments/assets/eff35257-0d1c-4242-a6a6-ae770b4d92d1" />

## useFilter

```typescript
const useFilter = (defaultValue, initialValue): {filters, reset, getFilter, setFilter}
```

---

```typescript
const useFilter = (defaultValue, initialValue, validate): {filters, getFilter, setFilter, checkFilter}
```

---

```typescript
import { z } from 'zod';

import { useFilter } from '@/hooks/useFilter';

export const Page = () => {
  const { filters, getFilter, setFilter, checkFilter } = useFilter<{
    age: number;
  }>({ age: 20 }, { age: 25 }, (filter) =>
    z
      .object({
        age: z.number().int().min(20).max(30),
      })
      .parse(filter),
  );
};
```

### lazy initialization

```typescript
export const useFilter = <Filters extends Record<string, FilterValue>>(
  defaultValue: Lazy<Filters>,
  initialValue: Lazy<Filters>,
  validate: (filter: Filters) => Filters,
): UseFilterReturn<Filters> => {};
```

```typescript
export type Lazy<T> = T | (() => T);

export const resolveLazy = <T>(value: Lazy<T>): T => {
  return typeof value === 'function' ? (value as () => T)() : value;
};
```

### validation 비용 줄이기

검증 비용을 줄이기 위해 `checkFilter`를 호출하는 필드만 유효성 검사를 하는 방법을 추가하는 것을 고민했으나

아래처럼 다른 필드와 연관 관계가 있을 수 있으므로 적용하지 못했습니다.

```typescript
z
  .object({
    size: z.number(),
    cost: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.size >= 10 && data.cost < 100) {
      ctx.addIssue();
    }

    if (data.size < 10 && data.cost >= 100) {
      ctx.addIssue();
    }
  }
```

<img width="584" height="81" alt="image" src="https://github.com/user-attachments/assets/7a5be873-0a8c-40e7-a605-ebc32c169b1e" />

## useSearchParams

```typescript
import { z } from 'zod';

import { useSearchParams } from '@/hooks/useSearchParams';

const SampleSearchParams: Parameters<
  typeof useSearchParams<{
    name: string;
    age: number;
    orderBy: 'price' | 'review' | 'date';
  }>
> = [
  { name: 'Kim', age: 25, orderBy: 'price' },
  (params) =>
    z
      .object({
        name: z.string(),
        age: z.coerce.number().int().min(20).max(30),
        orderBy: z.enum(['price', 'review', 'date']),
      })
      .parse(params),
];

export const SamplePage = () => {
  const { params, getParam, setParam } = useSearchParams(...SampleSearchParams);
};
```

```typescript
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
};
```

URL (searchParams)의 값을 초기에만 읽고, 필터를 State로만 관리할 경우 성능상 이점이 있으나 pushState 대응이 불가능
