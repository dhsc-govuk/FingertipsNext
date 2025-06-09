import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { FC } from 'react';
import { HeatmapBenchmarkOutcome } from '../../heatmapUtil';
import { StyledText } from './BenchmarkPill.styles';

interface BenchmarkPillTextProps {
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
    return <StyledText>No data available</StyledText>;
  }

  const valueString = `${formatNumber(value)}${formatUnitLabel(unitLabel)}`;

  if (outcome === 'Baseline') {
    return <StyledText>{valueString}</StyledText>;
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
      <StyledText>{valueString}</StyledText>
      <StyledText>{`${comparisonText()}${benchmarkConfidenceLimit()}`}</StyledText>
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
