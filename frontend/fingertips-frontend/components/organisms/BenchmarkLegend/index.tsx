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
}

export const BenchmarkLegend = () => {
  const model: BenchmarkData[] = [
    {
      group: 'rag',
      title: 'Areas compared to England',
      types: ['better', 'similar', 'worse', 'not_compared', 'lower', 'higher'],
    },
    {
      title: ' Quintile groupings',
      group: 'quintiles',
      types: ['lowest', 'low', 'middle', 'high', 'highest'],
    },
    {
      group: 'quintiles_wv',
      types: ['worst', 'worse', 'middle', 'better', 'best'],
    },
  ];

  return (
    <div>
      {model?.map((item, index) => (
        <DefaultBenchmarkLegendGroupPanelStyle key={item?.group + '_'+ index}>
          {(item.title !== null || item.title == '') && (
            <DefaultBenchmarkLegendHeaderStyle>
              {item.title}
            </DefaultBenchmarkLegendHeaderStyle>
          )}
          {item.types.map((type, label_key) => (
            <BenchmarkLabel
              group={item.group}
              type={type}
              key={item?.group + '_' + type + '_' + index +"-"+ label_key}
            />
          ))}
        </DefaultBenchmarkLegendGroupPanelStyle>
      ))}
    </div>
  );
};
