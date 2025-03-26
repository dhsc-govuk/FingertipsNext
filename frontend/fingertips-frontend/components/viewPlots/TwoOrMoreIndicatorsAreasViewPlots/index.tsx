'use client';

import { Heatmap, HeatmapIndicatorData } from '@/components/organisms/Heatmap';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { H2 } from 'govuk-react';

interface TwoOrMoreIndicatorsAreasViewPlotsProps {
  indicatorMetadata: IndicatorDocument[];
  healthData: HealthDataForArea[][];
  groupAreaCode?: string;
}

const buildHeatmapIndicatorData = (
  indicatorMetadata: IndicatorDocument[],
  healthData: HealthDataForArea[][]
): HeatmapIndicatorData[] => {
  return indicatorMetadata.map((metadata, index): HeatmapIndicatorData => {
    return {
      indicatorId: metadata.indicatorID,
      indicatorName: metadata.indicatorName,
      healthDataForAreas: healthData[index],
      unitLabel: metadata.unitLabel,
    };
  });
};

export function TwoOrMoreIndicatorsAreasViewPlots({
  indicatorMetadata,
  healthData,
  groupAreaCode,
}: TwoOrMoreIndicatorsAreasViewPlotsProps) {
  return (
    <>
      <H2>View data for selected indicators and areas</H2>
      <Heatmap
        indicatorData={buildHeatmapIndicatorData(indicatorMetadata, healthData)}
        groupAreaCode={groupAreaCode}
      />
    </>
  );
}
