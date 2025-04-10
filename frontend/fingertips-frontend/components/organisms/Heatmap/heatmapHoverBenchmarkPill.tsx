import { ReactNode } from 'react';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { GridCol, GridRow, Paragraph } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { HeatmapBenchmarkOutcome } from './heatmapUtil';
import {
  getBenchmarkColour,
  getConfidenceLimitNumber,
} from '@/lib/chartHelpers/chartHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

const StyledDivSquare = styled.div({
  width: '10px',
  height: '10px',
  display: 'block',
});

const StyledDivSquareBenchmarkColour = styled(StyledDivSquare).attrs<{
  $colour: string;
}>(({ $colour }) => ({
  style: { backgroundColor: `${$colour}`, border: `1px solid ${$colour}` },
}))<{ $colour: string }>(StyledDivSquare);

const StyledDivSquareBenchmarkNotCompared = styled(StyledDivSquare)({
  backgroundColor: GovukColours.White,
  border: `1px solid ${GovukColours.Black}`,
});

const StyledText = styled(Paragraph)(
  { marginBottom: '0' },
  typography.font({ size: 16 })
);

const StyledGridColIcon = styled(GridCol)({
  margin: 'auto',
  verticalAlign: 'middle',
  paddingRight: '4px',
});

export interface HeatmapHoverBenchmarkPillProps {
  value?: number;
  unitLabel: string;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

export function HeatmapHoverBenchmarkPill({
  value,
  unitLabel,
  outcome,
  benchmarkMethod,
  polarity,
}: Readonly<HeatmapHoverBenchmarkPillProps>): ReactNode {
  return (
    <GridRow>
      <StyledGridColIcon setWidth={'12px'}>
        {
          <BenchmarkPillIcon
            value={value}
            outcome={outcome}
            benchmarkMethod={benchmarkMethod}
            polarity={polarity}
            data-testid="heatmap-hover-benchmark-icon"
          />
        }
      </StyledGridColIcon>
      <GridCol>
        <BenchmarkPillText
          value={value}
          unitLabel={unitLabel}
          outcome={outcome}
          benchmarkMethod={benchmarkMethod}
        />
      </GridCol>
    </GridRow>
  );
}

interface BenchmarkPillIconProps {
  value?: number;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

function BenchmarkPillIcon({
  value,
  outcome,
  benchmarkMethod,
  polarity,
}: Readonly<BenchmarkPillIconProps>): React.ReactNode {
  if (value === undefined) {
    return <StyledText>{SymbolsEnum.MultiplicationX}</StyledText>;
  }

  if (outcome === BenchmarkOutcome.NotCompared) {
    return <StyledDivSquareBenchmarkNotCompared />;
  }

  if (outcome === 'Baseline') {
    return <StyledDivSquareBenchmarkColour $colour={GovukColours.Black} />;
  }

  return (
    <StyledDivSquareBenchmarkColour
      $colour={
        getBenchmarkColour(benchmarkMethod, outcome, polarity) ??
        GovukColours.White
      }
    />
  );
}

interface BenchmarkPillTextProps {
  value?: number;
  unitLabel: string;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
}

function BenchmarkPillText({
  value,
  unitLabel,
  outcome,
  benchmarkMethod,
}: Readonly<BenchmarkPillTextProps>): React.ReactNode {
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
        return `${outcome} to England`;
      default:
        return `${outcome} than England`;
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
}

function formatUnitLabel(unitLabel: string) {
  if (unitLabel === '%') {
    return unitLabel;
  } else {
    return ` ${unitLabel}`;
  }
}
