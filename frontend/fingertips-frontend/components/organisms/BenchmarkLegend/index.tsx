'use client';

import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import styled from 'styled-components';
import { FC, Fragment } from 'react';

const LegendContainer = styled.div({
  marginBottom: '2em',
});

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

const StyledLegendLabel = styled('span')({
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
});

export interface BenchmarkData {
  key: string;
  title?: string;
  types: Record<string, string[]>;
  suffix?: string;
}

interface BenchmarkLegendProps {
  rag?: boolean;
  quintiles?: boolean;
}

export const BenchmarkLegend: FC<BenchmarkLegendProps> = ({
  rag,
  quintiles,
}) => {
  const model: BenchmarkData[] = [];
  if (rag) {
    model.push({
      key: 'rag',
      title: 'Compared to England',
      types: {
        rag: ['Better', 'Similar', 'Worse', 'not_compared'],
        bob: ['Lower', 'Higher'],
      },
      suffix: '(95% confidence)',
    });
    model.push({
      key: 'rag_99',
      types: {
        rag_99: ['Better', 'Similar', 'Worse', 'not_compared'],
        bob_99: ['Lower', 'Higher'],
      },
      suffix: '(99.8% confidence)',
    });
  }

  if (quintiles) {
    model.push({
      key: 'quintiles',
      title: ' Quintiles',
      types: { quintiles: ['Lowest', 'Low', 'Middle', 'High', 'Highest'] },
    });
    model.push({
      key: 'quintiles_with_judgement',
      types: {
        quintiles_with_judgement: [
          'Worst',
          'Worse',
          'Middle',
          'Better',
          'Best',
        ],
      },
    });
  }

  return (
    <LegendContainer data-testid="benchmarkLegend-component">
      {model?.map((item, index) => (
        <DefaultBenchmarkLegendGroupPanelStyle key={item.key}>
          {item.title ? (
            <DefaultBenchmarkLegendHeaderStyle>
              {item.title}
            </DefaultBenchmarkLegendHeaderStyle>
          ) : null}
          <div>
            {Object.keys(item.types).map((group) => (
              <Fragment key={group}>
                {Object.values(item.types[group]).map((type) => (
                  <BenchmarkLabel
                    group={group}
                    type={type}
                    key={group + '_' + type + '_' + index}
                  />
                ))}
              </Fragment>
            ))}
            {item.suffix ? (
              <StyledLegendLabel>{item.suffix}</StyledLegendLabel>
            ) : null}
          </div>
        </DefaultBenchmarkLegendGroupPanelStyle>
      ))}
    </LegendContainer>
  );
};
