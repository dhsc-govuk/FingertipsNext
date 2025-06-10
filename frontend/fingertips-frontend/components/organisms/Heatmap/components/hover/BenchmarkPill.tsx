import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { GridCol, GridRow } from 'govuk-react';
import { HeatmapBenchmarkOutcome } from '../../heatmapUtil';
import { IconGridCol } from './BenchmarkPill.styles';
import { BenchmarkPillIcon } from './BenchmarkPillIcon';
import { BenchmarkPillText } from './BenchmarkPillText';

export interface HeatmapHoverBenchmarkPillProps {
  value?: number;
  unitLabel: string;
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkAreaName: string;
}

export const HeatmapHoverBenchmarkPill: FC<HeatmapHoverBenchmarkPillProps> = ({
  value,
  unitLabel,
  outcome,
  benchmarkMethod,
  polarity,
  benchmarkAreaName,
}) => {
  return (
    <GridRow>
      <IconGridCol setWidth={'12px'}>
        {
          <BenchmarkPillIcon
            value={value}
            outcome={outcome}
            benchmarkMethod={benchmarkMethod}
            polarity={polarity}
            data-testid="heatmap-hover-benchmark-icon"
          />
        }
      </IconGridCol>
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
