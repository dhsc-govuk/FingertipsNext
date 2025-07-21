'use client';

import { PopulationPyramid } from '@/components/charts/PopulationPyramid/PopulationPyramid';
import { usePopulationPyramidData } from '@/components/charts/PopulationPyramid/hooks/usePopulationPyramidData';

export function PopulationPyramidWrapper() {
  const { healthData } = usePopulationPyramidData();
  if (!healthData) return null;

  return (
    <PopulationPyramid
      healthDataForAreas={healthData.areaHealthData ?? []}
      xAxisTitle="Age"
      yAxisTitle="Percentage of total population"
      indicatorId={String(healthData.indicatorId ?? 0)}
      indicatorName={healthData.name ?? ''}
    />
  );
}
