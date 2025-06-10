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
  BenchmarkPillText,
  NotComparedBenchmarkIcon,
  ColouredBenchmarkIcon,
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
    return <BenchmarkPillText>{SymbolsEnum.MultiplicationX}</BenchmarkPillText>;
  }

  if (outcome === BenchmarkOutcome.NotCompared) {
    return <NotComparedBenchmarkIcon />;
  }

  if (outcome === 'Baseline') {
    return <ColouredBenchmarkIcon $colour={GovukColours.DarkGrey} />;
  }

  return (
    <ColouredBenchmarkIcon
      $colour={
        getBenchmarkColour(benchmarkMethod, outcome, polarity) ??
        GovukColours.White
      }
    />
  );
};
