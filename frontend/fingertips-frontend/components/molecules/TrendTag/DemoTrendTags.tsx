import { Trend, TrendCondition } from '@/lib/common-types';
import { TrendTag } from '@/components/molecules/TrendTag/index';
import { FC } from 'react';
import styled from 'styled-components';

const Div = styled('div')({
  margin: '4em 0',
});

const Th = styled('th')({
  borderBottom: '1px solid gray',
});

const Td = styled('td')({
  borderBottom: '1px solid gray',
  padding: '1em 0',
});

export const DemoTrendTags: FC = () => {
  const trendConditions: (TrendCondition | undefined)[] =
    Object.values(TrendCondition);
  trendConditions.push(undefined);

  return (
    <Div>
      <table>
        <thead>
          <tr>
            <Th>Trend</Th>
            {trendConditions.map((trendCondition) => (
              <Th key={trendCondition ?? 'none'}>
                {trendCondition ?? 'undefined'}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(Trend).map((trend) => (
            <tr key={trend}>
              <Td>{trend}</Td>
              {trendConditions.map((trendCondition) => (
                <Td key={`${trend}-${trendCondition}`}>
                  <TrendTag trend={trend} trendCondition={trendCondition} />
                  <TrendTag
                    trend={trend}
                    trendCondition={trendCondition}
                    useArrow={false}
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Div>
  );
};
