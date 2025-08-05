import { HeatMapWrapper } from '@/components/charts/HeatMap/HeatMapWrapper';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

export function SingleIndicatorHeatMap() {
  const { indicatorMetaData, healthData } = useOneIndicatorData();
  if (!indicatorMetaData || !healthData) return null;

  const { title, subTitle } =
    chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorHeatmap];

  return (
    <HeatMapWrapper
      indicatorMetaData={[indicatorMetaData]}
      healthData={[healthData]}
      title={title}
      subTitle={subTitle}
    />
  );
}
