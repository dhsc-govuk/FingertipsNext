import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import { FC } from 'react';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';

const LegendGroup = styled('div')({
  position: 'relative',
  left: '-5px',
});

const StyledLegendLabel = styled('span')({
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
});

interface BenchmarkLegendProps {
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  outcomes: BenchmarkOutcome[];
  polarity: IndicatorPolarity;
}

const BenchmarkLegendGroup: FC<BenchmarkLegendProps> = ({
  outcomes,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity,
}) => {
  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const suffix = confidenceLimit ? `(${confidenceLimit}% confidence)` : null;
  return (
    <LegendGroup>
      {outcomes.map((outcome) => (
        <BenchmarkLabel
          key={benchmarkComparisonMethod + '_' + outcome}
          method={benchmarkComparisonMethod}
          outcome={outcome}
          polarity={polarity}
        />
      ))}

      {suffix ? <StyledLegendLabel>{suffix}</StyledLegendLabel> : null}
    </LegendGroup>
  );
};

export default BenchmarkLegendGroup;
