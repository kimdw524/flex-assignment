import { Button, Flex } from '@kimdw-rtk/ui';
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

  return (
    <>
      <p>params: {JSON.stringify(params)}</p>
      <Flex gap="lg">
        <Button
          onClick={() => {
            setParam('age', getParam('age') - 1);
          }}
        >
          age - 1
        </Button>
        <Button
          onClick={() => {
            setParam('age', getParam('age') + 1);
          }}
        >
          age + 1
        </Button>
      </Flex>
      <Flex gap="sm" marginTop="lg">
        <Button
          color="secondary"
          size="sm"
          onClick={() => setParam('orderBy', 'price')}
        >
          가격순
        </Button>
        <Button
          color="secondary"
          size="sm"
          onClick={() => setParam('orderBy', 'review')}
        >
          리뷰순
        </Button>
        <Button
          color="secondary"
          size="sm"
          onClick={() => setParam('orderBy', 'date')}
        >
          등록일순
        </Button>
      </Flex>
    </>
  );
};
