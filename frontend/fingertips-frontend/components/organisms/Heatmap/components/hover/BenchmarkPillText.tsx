import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { FC } from 'react';
import { HeatmapBenchmarkOutcome } from '../../heatmap.types';
import { BenchmarkPillParagraph } from './BenchmarkPill.styles';

export interface BenchmarkPillTextProps {
  value?: number;
  unitLabel: string;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  benchmarkAreaName: string;
}

export const BenchmarkPillText: FC<BenchmarkPillTextProps> = ({
  value,
  unitLabel,
  outcome,
  benchmarkMethod,
  benchmarkAreaName,
}) => {
  if (value === undefined) {
    return <BenchmarkPillParagraph>No data available</BenchmarkPillParagraph>;
  }

  const valueString = `${formatNumber(value)}${formatUnitLabel(unitLabel)}`;

  if (outcome === 'Baseline') {
    return <BenchmarkPillParagraph>{valueString}</BenchmarkPillParagraph>;
  }

  const comparisonText = () => {
    switch (true) {
      case benchmarkMethod === BenchmarkComparisonMethod.Quintiles:
        return `${outcome} quintile`;
      case benchmarkMethod === BenchmarkComparisonMethod.Unknown:
      case outcome === BenchmarkOutcome.NotCompared:
        return `Not compared`;
      case outcome === BenchmarkOutcome.Similar:
        return `${outcome} to ${benchmarkAreaName}`;
      default:
        return `${outcome} than ${benchmarkAreaName}`;
    }
  };

  const benchmarkConfidenceLimit = () => {
    const confidenceLimit = getConfidenceLimitNumber(benchmarkMethod);
    return confidenceLimit ? ` (${confidenceLimit}%)` : '';
  };

  return (
    <>
      <BenchmarkPillParagraph>{valueString}</BenchmarkPillParagraph>
      <BenchmarkPillParagraph>{`${comparisonText()}${benchmarkConfidenceLimit()}`}</BenchmarkPillParagraph>
    </>
  );
};

const formatUnitLabel = (unitLabel: string) => {
  if (unitLabel === '%') {
    return unitLabel;
  } else {
    return ` ${unitLabel}`;
  }
};
