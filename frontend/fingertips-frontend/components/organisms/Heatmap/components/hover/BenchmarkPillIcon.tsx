import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { FC } from 'react';
import { HeatmapBenchmarkOutcome } from '../../heatmapUtil';
import {
  StyledText,
  StyledDivSquareBenchmarkNotCompared,
  StyledDivSquareBenchmarkColour,
} from './BenchmarkPill.styles';

interface BenchmarkPillIconProps {
  value?: number;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

export const BenchmarkPillIcon: FC<BenchmarkPillIconProps> = ({
  value,
  outcome,
  benchmarkMethod,
  polarity,
}) => {
  if (value === undefined) {
    return <StyledText>{SymbolsEnum.MultiplicationX}</StyledText>;
  }

  if (outcome === BenchmarkOutcome.NotCompared) {
    return <StyledDivSquareBenchmarkNotCompared />;
  }

  if (outcome === 'Baseline') {
    return <StyledDivSquareBenchmarkColour $colour={GovukColours.DarkGrey} />;
  }

  return (
    <StyledDivSquareBenchmarkColour
      $colour={
        getBenchmarkColour(benchmarkMethod, outcome, polarity) ??
        GovukColours.White
      }
    />
  );
};
