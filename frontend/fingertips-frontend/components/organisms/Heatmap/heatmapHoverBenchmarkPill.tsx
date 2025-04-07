import React from 'react';
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

interface HeatmapHoverBenchmarkPillProps {
  value?: string;
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
}: HeatmapHoverBenchmarkPillProps): React.ReactNode {
  return (
    <GridRow>
      <StyledGridColIcon setWidth={'12px'}>
        {
          <BenchmarkPillIcon
            value={value}
            unitLabel={unitLabel}
            outcome={outcome}
            benchmarkMethod={benchmarkMethod}
            polarity={polarity}
          />
        }
      </StyledGridColIcon>
      <GridCol>
        <BenchmarkPillText
          value={value}
          unitLabel={unitLabel}
          outcome={outcome}
          benchmarkMethod={benchmarkMethod}
          polarity={polarity}
        />
      </GridCol>
    </GridRow>
  );
}

function BenchmarkPillIcon({
  value,
  outcome,
  benchmarkMethod,
  polarity,
}: HeatmapHoverBenchmarkPillProps): React.ReactNode {
  if (!value || value === 'X') {
    return <StyledText>{'\u2715'}</StyledText>;
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

function BenchmarkPillText({
  value,
  unitLabel,
  outcome,
  benchmarkMethod,
}: HeatmapHoverBenchmarkPillProps): React.ReactNode {
  if (!value || value === 'X') {
    return <StyledText>No data available</StyledText>;
  }

  const valueString = `${value}${formatUnitLabel(unitLabel)}`;

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

  const benchmarkConfidenceLimit = getConfidenceLimitNumber(benchmarkMethod);

  return (
    <>
      <StyledText>{valueString}</StyledText>
      <StyledText>{comparisonText()}</StyledText>
      {benchmarkConfidenceLimit ? (
        <StyledText>{`(${benchmarkConfidenceLimit}%)`}</StyledText>
      ) : null}
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
