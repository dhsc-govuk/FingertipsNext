'use client';

import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { H3 } from 'govuk-react';
import { BasicTableData, BasicTable } from '@/components/organisms/BasicTable';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';

type TwoOrMoreIndicatorsEnglandViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
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
): BasicTableData[] => {
  return indicatorData.map((indicator) => {
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
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  const englandIndicatorData = getEnglandIndicatorTableData(
    indicatorData,
    indicatorMetadata
  );

  const areaName =
    indicatorData.find((item) => item.areaHealthData?.[0]?.areaName)
      ?.areaHealthData?.[0]?.areaName ?? '';

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <StyleChartWrapper>
        <H3>Compare indicators for an area</H3>
        <BasicTable indicatorData={englandIndicatorData} areaName={areaName} />
      </StyleChartWrapper>
    </section>
  );
}
