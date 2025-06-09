import { FC } from 'react';
import { HeaderType } from '../../heatmapTypes';
import { IndicatorTitleHeader } from './IndicatorTitleHeader';
import { IndicatorPeriodHeader } from './IndicatorPeriodHeader';
import { IndicatorValueUnitHeader } from './IndicatorValueUnitHeader';
import { AreaPrimaryBenchmarkHeader } from './AreaBenchmarkGroupHeader';
import { AreaSecondaryBenchmarkHeader } from './AreaNonBenchmarkGroupHeader';
import { AreaHeader } from './AreaHeader';

interface HeatmapHeaderProps {
  headerType: HeaderType;
  content: string;
}

export const HeatmapHeader: FC<HeatmapHeaderProps> = ({
  headerType,
  content,
}) => {
  switch (headerType) {
    case HeaderType.IndicatorTitle:
      return <IndicatorTitleHeader content={content} />;
    case HeaderType.Period:
      return <IndicatorPeriodHeader content={content} />;
    case HeaderType.ValueUnit:
      return <IndicatorValueUnitHeader content={content} />;

    case HeaderType.BenchmarkGroupArea:
      return <AreaPrimaryBenchmarkHeader content={content} />;
    case HeaderType.NonBenchmarkGroupArea:
      return <AreaSecondaryBenchmarkHeader content={content} />;
    case HeaderType.Area:
      return <AreaHeader content={content} />;
  }
};
