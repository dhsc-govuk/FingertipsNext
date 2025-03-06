'use client';

import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel/index';
import styled from 'styled-components';

const DefaultBenchmarkLegendGroupPanelStyle = styled('div')({
  alignItems: 'center',
  alignContent: 'center',
});

const DefaultBenchmarkLegendHeaderStyle = styled('h4')({
  alignSelf: 'stretch',
  margin: '0.1em',
});

export interface BenchmarkData {
  title?: string;
  group: string;
  types: string[];
  suffix?: string;
}

export const BenchmarkLegend = () => {
  const model: BenchmarkData[] = [
    {
      group: 'rag',
      title: 'Areas compared to England',
      types: ['Better', 'Similar', 'Worse', 'not_compared', 'Lower', 'Higher'],
      suffix: '(95% confidence)',
    },
    {
      group: 'rag_99',
      types: ['Better', 'Similar', 'Worse', 'not_compared', 'Lower', 'Higher'],
      suffix: '(99.8% confidence)',
    },
    {
      title: ' Quintile groupings',
      group: 'quintiles',
      types: ['Lowest', 'Low', 'Middle', 'High', 'Highest'],
    },
    {
      group: 'quintiles_wv',
      types: ['Worst', 'Worse', 'Middle', 'Better', 'Best'],
    },
  ];

  return (
    <div>
      {model?.map((item, index) => (
        <DefaultBenchmarkLegendGroupPanelStyle key={item.group + '_' + index}>
          {(item.title !== null || item.title == '') && (
            <DefaultBenchmarkLegendHeaderStyle>
              {item.title}
            </DefaultBenchmarkLegendHeaderStyle>
          )}
          <div>
            {item.types.map((type, label_key) => (
              <BenchmarkLabel
                group={item.group}
                type={type}
                key={item.group + '_' + type + '_' + index + '-' + label_key}
              />
            ))}
            {item.suffix}
          </div>
        </DefaultBenchmarkLegendGroupPanelStyle>
      ))}
    </div>
  );
};
