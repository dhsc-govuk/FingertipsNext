'use client';

import { TwoOrMoreIndicatorsEnglandViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { SearchStateManager } from '@/lib/searchStateManager';
import {
  EnglandAreaTypeIndicatorData,
  EnglandAreaTypeTable,
} from '@/components/organisms/EnglandAreaTypeTable';
import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export function TwoOrMoreIndicatorsEnglandViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  SearchStateManager.initialise(searchState);

  const getLatestHealthDataForEngland = (
    indicatorData: IndicatorWithHealthDataForArea,
    latestPeriod: string | undefined
  ): HealthDataPoint | undefined => {
    if (indicatorData.areaHealthData?.[0]?.healthData) {
      return indicatorData.areaHealthData?.[0].healthData?.find(
        (item) => item.year.toString() === latestPeriod
      );
    }
    return undefined;
  };

  const englandIndicatorData: EnglandAreaTypeIndicatorData[] =
    indicatorData.map((indicator) => {
      const hasHealthDataForEngland =
        indicator.areaHealthData?.[0]?.healthData !== undefined;

      const metaDataForIndicator = indicatorMetadata.find(
        (indicatorMeta) =>
          indicatorMeta?.indicatorID === indicator.indicatorId?.toString()
      );

      const latestPeriod = hasHealthDataForEngland
        ? metaDataForIndicator?.latestDataPeriod
        : undefined;
      const latestData2 = getLatestHealthDataForEngland(
        indicator,
        latestPeriod
      );

      const unitLabel = hasHealthDataForEngland
        ? metaDataForIndicator?.unitLabel
        : undefined;

      return {
        indicatorId: indicator.indicatorId,
        indicatorName: indicator.name,
        period: latestPeriod,
        latestEnglandHealthData: latestData2,
        unitLabel,
      };
    });

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <EnglandAreaTypeTable indicatorData={englandIndicatorData} />
    </section>
  );
}
