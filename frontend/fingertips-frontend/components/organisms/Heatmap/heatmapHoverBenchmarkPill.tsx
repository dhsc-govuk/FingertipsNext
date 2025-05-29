import { FC } from 'react';
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
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

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
  benchmarkAreaCode: string;
  benchmarkAreaName: string;
}

export const HeatmapHoverBenchmarkPill: FC<HeatmapHoverBenchmarkPillProps> = ({
  value,
  unitLabel,
  outcome,
  benchmarkMethod,
  polarity,
  benchmarkAreaCode,
  benchmarkAreaName,
}) => {
  return (
    <GridRow>
      <StyledGridColIcon setWidth={'12px'}>
        {
          <BenchmarkPillIcon
            value={value}
            outcome={outcome}
            benchmarkMethod={benchmarkMethod}
            polarity={polarity}
            benchmarkAreaCode={benchmarkAreaCode}
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
          benchmarkAreaName={benchmarkAreaName}
        />
      </GridCol>
    </GridRow>
  );
};

interface BenchmarkPillIconProps {
  value?: number;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkAreaCode: string;
}

const BenchmarkPillIcon: FC<BenchmarkPillIconProps> = ({
  value,
  outcome,
  benchmarkMethod,
  polarity,
  benchmarkAreaCode,
}) => {
  if (value === undefined) {
    return <StyledText>{SymbolsEnum.MultiplicationX}</StyledText>;
  }

  if (outcome === BenchmarkOutcome.NotCompared) {
    return <StyledDivSquareBenchmarkNotCompared />;
  }

  if (outcome === 'Baseline') {
    return (
      <StyledDivSquareBenchmarkColour
        $colour={
          benchmarkAreaCode === areaCodeForEngland
            ? GovukColours.Black
            : GovukColours.Pink
        }
      />
    );
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

interface BenchmarkPillTextProps {
  value?: number;
  unitLabel: string;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  benchmarkAreaName: string;
}

const BenchmarkPillText: FC<BenchmarkPillTextProps> = ({
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
