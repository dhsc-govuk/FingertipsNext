import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { FC } from 'react';
import { HeatmapBenchmarkOutcome } from '../../heatmap.types';
import {
  BenchmarkPillParagraph,
  NotComparedBenchmarkIcon,
  ColouredBenchmarkIcon,
} from './BenchmarkPill.styles';

export interface BenchmarkPillIconProps {
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
    return (
      <BenchmarkPillParagraph data-testid={'heatmap-benchmark-icon'}>
        {SymbolsEnum.MultiplicationX}
      </BenchmarkPillParagraph>
    );
  }

  if (outcome === BenchmarkOutcome.NotCompared) {
    return <NotComparedBenchmarkIcon data-testid={'heatmap-benchmark-icon'} />;
  }

  if (outcome === 'Baseline') {
    return (
      <ColouredBenchmarkIcon
        data-testid={'heatmap-benchmark-icon'}
        $colour={GovukColours.DarkGrey}
      />
    );
  }

  return (
    <ColouredBenchmarkIcon
      data-testid={'heatmap-benchmark-icon'}
      $colour={
        getBenchmarkColour(benchmarkMethod, outcome, polarity) ??
        GovukColours.White
      }
    />
  );
};
