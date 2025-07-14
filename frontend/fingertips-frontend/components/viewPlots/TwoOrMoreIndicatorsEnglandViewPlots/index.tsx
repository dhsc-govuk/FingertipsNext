'use client';

import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { H3 } from 'govuk-react';
import { BasicTableData, BasicTable } from '@/components/organisms/BasicTable';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks';
import { ChartTitleKeysEnum } from '@/lib/ChartTitles/chartTitleEnums';

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

  const availableChartLinks: string[] = [
    ChartTitleKeysEnum.BasicTableChart,
    ChartTitleKeysEnum.PopulationPyramid,
  ];

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <AvailableChartLinks
        availableCharts={availableChartLinks}
      ></AvailableChartLinks>
      <StyleChartWrapper>
        <H3 id="basic-table-chart">Compare indicators for an area</H3>
        <BasicTable indicatorData={englandIndicatorData} areaName={areaName} />
      </StyleChartWrapper>
    </section>
  );
}
