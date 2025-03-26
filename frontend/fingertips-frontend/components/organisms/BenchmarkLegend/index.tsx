'use client';

import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import styled from 'styled-components';
import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

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
  method: BenchmarkComparisonMethod;
  outcomes: BenchmarkOutcome[];
  suffix?: string;
  polarity?: IndicatorPolarity;
}

interface BenchmarkLegendProps {
  rag?: boolean;
  quintiles?: boolean;
}

const ragOutcomes = [
  BenchmarkOutcome.Better,
  BenchmarkOutcome.Similar,
  BenchmarkOutcome.Worse,
  BenchmarkOutcome.NotCompared,
];
const bobOutcomes = [BenchmarkOutcome.Lower, BenchmarkOutcome.Higher];
const quintilesOutcomes = [
  BenchmarkOutcome.Lowest,
  BenchmarkOutcome.Low,
  BenchmarkOutcome.Middle,
  BenchmarkOutcome.High,
  BenchmarkOutcome.Highest,
];
const quintilesOutcomesWithJudgement = [
  BenchmarkOutcome.Worst,
  BenchmarkOutcome.Worse,
  BenchmarkOutcome.Middle,
  BenchmarkOutcome.Better,
  BenchmarkOutcome.Best,
];

export const BenchmarkLegend: FC<BenchmarkLegendProps> = ({
  rag,
  quintiles,
}) => {
  const model: BenchmarkData[] = [];
  if (rag) {
    model.push({
      key: 'rag',
      title: 'Compared to England',
      method: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      outcomes: [...ragOutcomes, ...bobOutcomes],
      suffix: '(95% confidence)',
    });
    model.push({
      key: 'rag_99',
      method: BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
      outcomes: [...ragOutcomes, ...bobOutcomes],
      suffix: '(99.8% confidence)',
    });
  }

  if (quintiles) {
    model.push({
      key: 'quintiles',
      method: BenchmarkComparisonMethod.Quintiles,
      title: ' Quintiles',
      outcomes: quintilesOutcomes,
      polarity: IndicatorPolarity.NoJudgement,
    });
    model.push({
      key: 'quintiles_with_judgement',
      method: BenchmarkComparisonMethod.Quintiles,
      outcomes: quintilesOutcomesWithJudgement,
    });
  }

  return (
    <LegendContainer>
      {model?.map((item, index) => (
        <DefaultBenchmarkLegendGroupPanelStyle key={item.key}>
          {item.title ? (
            <DefaultBenchmarkLegendHeaderStyle>
              {item.title}
            </DefaultBenchmarkLegendHeaderStyle>
          ) : null}
          <div>
            {item.outcomes.map((outcome) => (
              <BenchmarkLabel
                key={item.method + '_' + outcome + '_' + index}
                method={item.method}
                outcome={outcome}
                polarity={item.polarity}
              />
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
