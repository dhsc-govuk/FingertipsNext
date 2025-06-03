import { FC } from 'react';
import { HeaderType } from '../../heatmapUtil';
import { IndicatorTitleHeader } from './indicatorTitleHeader';
import { IndicatorPeriodHeader } from './indicatorPeriodHeader';
import { IndicatorValueUnitHeader } from './indicatorValueUnitHeader';
import { AreaPrimaryBenchmarkHeader } from './areaBenchmarkGroupHeader';
import { AreaSecondaryBenchmarkHeader } from './areaNonBenchmarkGroupHeader';
import { AreaHeader } from './areaHeader';

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
    case HeaderType.IndicatorInformationPeriod:
      return <IndicatorPeriodHeader content={content} />;
    case HeaderType.IndicatorInformationValueUnit:
      return <IndicatorValueUnitHeader content={content} />;

    case HeaderType.PrimaryBenchmarkArea:
      return <AreaPrimaryBenchmarkHeader content={content} />;
    case HeaderType.SecondaryBenchmarkArea:
      return <AreaSecondaryBenchmarkHeader content={content} />;
    case HeaderType.Area:
      return <AreaHeader content={content} />;
  }
};
