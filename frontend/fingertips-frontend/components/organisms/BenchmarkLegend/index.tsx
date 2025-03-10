'use client';

import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import styled from 'styled-components';

const DefaultBenchmarkLegendGroupPanelStyle = styled('div')({
  alignItems: 'center',
  alignContent: 'center',
});

const DefaultBenchmarkLegendHeaderStyle = styled('h4')({
  alignSelf: 'stretch',
  margin: '1em 0.1em 0.1em 0.1em',
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
});

const StyledLengendLabel = styled('span')({
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
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
      title: 'Compared to England',
      types: ['Better', 'Similar', 'Worse', 'not_compared', 'Lower', 'Higher'],
      suffix: '(95% confidence)',
    },
    {
      group: 'rag_99',
      types: ['Better', 'Similar', 'Worse', 'not_compared', 'Lower', 'Higher'],
      suffix: '(99.8% confidence)',
    },
    {
      title: ' Quintiles',
      group: 'quintiles',
      types: ['Lowest', 'Low', 'Middle', 'High', 'Highest'],
    },
    {
      group: 'quintiles_with_judgement',
      types: ['Worst', 'Worse', 'Middle', 'Better', 'Best'],
    },
  ];

  return (
    <div>
      {model?.map((item, index) => (
        <DefaultBenchmarkLegendGroupPanelStyle key={item.group + '_' + index}>
          {item.title ? (
            <DefaultBenchmarkLegendHeaderStyle>
              {item.title}
            </DefaultBenchmarkLegendHeaderStyle>
          ) : null}
          <div>
            {item.types.map((type, label_key) => (
              <BenchmarkLabel
                group={item.group}
                type={type}
                key={item.group + '_' + type + '_' + index + '-' + label_key}
              />
            ))}
            {item.suffix ? (
              <StyledLengendLabel>{item.suffix}</StyledLengendLabel>
            ) : null}
          </div>
        </DefaultBenchmarkLegendGroupPanelStyle>
      ))}
    </div>
  );
};
