import { Trend, TrendCondition } from '@/lib/common-types';
import { TrendTag } from '@/components/molecules/TrendTag/index';
import { FC } from 'react';
import styled from 'styled-components';

const Div = styled('div')({
  margin: '4em 0',
});

const TH = styled('th')({
  borderBottom: '1px solid gray',
});

const TD = styled('td')({
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
            <TH>Trend</TH>
            {trendConditions.map((trendCondition) => (
              <TH key={trendCondition ?? 'none'}>
                {trendCondition ?? 'undefined'}
              </TH>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(Trend).map((trend) => (
            <tr key={trend}>
              <TD>{trend}</TD>
              {trendConditions.map((trendCondition) => (
                <TD key={`${trend}-${trendCondition}`}>
                  {trend === Trend.SIMILAR && trendCondition ? (
                    'Invalid'
                  ) : (
                    <>
                      <TrendTag trend={trend} trendCondition={trendCondition} />
                      <TrendTag
                        trend={trend}
                        trendCondition={trendCondition}
                        useArrow={false}
                      />
                    </>
                  )}
                </TD>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Div>
  );
};
