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

  return <></>;
};
