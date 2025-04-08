'use client';

import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { H3 } from 'govuk-react';
import {
  OneAreaMultipleIndicatorsData,
  OneAreaMultipleIndicatorsTable,
} from '@/components/organisms/OneAreaMultipleIndicatorsTable';

type TwoOrMoreIndicatorsEnglandViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata: IndicatorDocument[];
};

export const getLatestPeriodHealthDataPoint = (
  indicatorData: IndicatorWithHealthDataForArea,
  latestPeriod?: string
): HealthDataPoint | undefined => {
  if (indicatorData.areaHealthData?.[0]?.healthData) {
    return indicatorData.areaHealthData?.[0].healthData?.find(
      (item) => item.year.toString() === latestPeriod
    );
  }
  return undefined;
};

export const getEnglandIndicatorTableData = (
  indicatorData: IndicatorWithHealthDataForArea[],
  indicatorMetadata: IndicatorDocument[]
): OneAreaMultipleIndicatorsData[] => {
  return indicatorData.map((indicator) => {
    console.log('indicator data', indicatorData);
    const hasHealthDataForEngland =
      indicator.areaHealthData?.[0]?.healthData !== undefined;

    const metaDataForIndicator = indicatorMetadata?.find(
      (indicatorMeta) =>
        indicatorMeta?.indicatorID === indicator.indicatorId?.toString()
    );

    const latestPeriod = hasHealthDataForEngland
      ? metaDataForIndicator?.latestDataPeriod
      : undefined;

    const latestEnglandHealthData = hasHealthDataForEngland
      ? getLatestPeriodHealthDataPoint(indicator, latestPeriod)
      : undefined;

    const unitLabel = hasHealthDataForEngland
      ? metaDataForIndicator?.unitLabel
      : undefined;

    return {
      indicatorId: indicator.indicatorId,
      indicatorName: indicator.name,
      period: latestPeriod,
      latestEnglandHealthData,
      unitLabel,
    };
  });
};

export function TwoOrMoreIndicatorsEnglandViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  SearchStateManager.initialise(searchState);

  const englandIndicatorData = getEnglandIndicatorTableData(
    indicatorData,
    indicatorMetadata
  );

  const areaName =
    indicatorData.find((item) => item.areaHealthData?.[0]?.areaName)
      ?.areaHealthData?.[0]?.areaName ?? '';

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <H3>Compare indicators for an area</H3>
      <OneAreaMultipleIndicatorsTable
        indicatorData={englandIndicatorData}
        areaName={areaName}
      />
    </section>
  );
}
