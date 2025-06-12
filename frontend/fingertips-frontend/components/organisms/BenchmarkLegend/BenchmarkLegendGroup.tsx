import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { FC } from 'react';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import {
  LegendGroup,
  StyledLegendLabel,
} from '@/components/organisms/BenchmarkLegend/BenchmarkLegend.styles';

interface BenchmarkLegendProps {
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  outcomes: BenchmarkOutcome[];
  polarity: IndicatorPolarity;
  subTitle?: string;
}

export const BenchmarkLegendGroup: FC<BenchmarkLegendProps> = ({
  outcomes,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity,
  subTitle,
}) => {
  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const prefix = confidenceLimit
    ? `${confidenceLimit}% confidence`
    : 'Quintiles';

  const subTitleText = subTitle ?? prefix;

  return (
    <>
      {subTitleText ? (
        <StyledLegendLabel>{subTitleText}</StyledLegendLabel>
      ) : null}
      <LegendGroup role={'group'}>
        {outcomes.map((outcome) => (
          <BenchmarkLabel
            key={benchmarkComparisonMethod + '_' + outcome}
            method={benchmarkComparisonMethod}
            outcome={outcome}
            polarity={polarity}
          />
        ))}
      </LegendGroup>
    </>
  );
};
