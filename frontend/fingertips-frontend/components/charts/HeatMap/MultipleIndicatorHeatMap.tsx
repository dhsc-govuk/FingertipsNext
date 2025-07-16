import { useMultipleIndicatorData } from '@/components/charts/hooks/useMultipleIndicatorData';
import { HeatMapWrapper } from '@/components/charts/HeatMap/HeatMapWrapper';

export function MultipleIndicatorHeatMap() {
  const { indicatorMetaData, healthData } = useMultipleIndicatorData();
  return (
    <HeatMapWrapper
      indicatorMetaData={indicatorMetaData}
      healthData={healthData}
    />
  );
}
