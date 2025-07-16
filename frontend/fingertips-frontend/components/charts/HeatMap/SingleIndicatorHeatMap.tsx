import { HeatMapWrapper } from '@/components/charts/HeatMap/HeatMapWrapper';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';

export function SingleIndicatorHeatMap() {
  const { indicatorMetaData, healthData } = useOneIndicatorData();
  if (!indicatorMetaData || !healthData) return null;

  return (
    <HeatMapWrapper
      indicatorMetaData={[indicatorMetaData]}
      healthData={[healthData]}
      title={'Indicator segmentations overview'}
      subTitle={'Segmentation overview of selected indicator'}
    />
  );
}
