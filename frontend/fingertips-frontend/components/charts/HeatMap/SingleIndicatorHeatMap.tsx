import { HeatMapWrapper } from '@/components/charts/HeatMap/HeatMapWrapper';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';
import { heatMapText } from '@/components/charts/HeatMap/heatmapConstants';

export function SingleIndicatorHeatMap() {
  const { indicatorMetaData, healthData } = useOneIndicatorData();
  if (!indicatorMetaData || !healthData) return null;

  const { title, subTitle } = heatMapText.singleIndicator;

  return (
    <HeatMapWrapper
      indicatorMetaData={[indicatorMetaData]}
      healthData={[healthData]}
      title={title}
      subTitle={subTitle}
    />
  );
}
