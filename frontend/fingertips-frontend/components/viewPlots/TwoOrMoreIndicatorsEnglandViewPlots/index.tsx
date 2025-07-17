'use client';

import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { H3 } from 'govuk-react';

import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { BasicTableData } from '@/components/charts/BasicTable/basicTable.types';
import { BasicTable } from '@/components/charts/BasicTable/BasicTable';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

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
      areaName: englandAreaString,
      areaCode: areaCodeForEngland,
      period: latestPeriod,
      unitLabel,
      count: latestEnglandHealthData?.count,
      value: latestEnglandHealthData?.value,
      trend: latestEnglandHealthData?.trend,
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

  const availableChartLinks: ChartTitleKeysEnum[] = [
    ChartTitleKeysEnum.BasicTableChart,
    ChartTitleKeysEnum.PopulationPyramid,
  ];

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <AvailableChartLinks
        availableCharts={availableChartLinks}
      ></AvailableChartLinks>
      <StyleChartWrapper>
        <H3 id={ChartTitleKeysEnum.BasicTableChart}>
          {chartTitleConfig[ChartTitleKeysEnum.BasicTableChart].title}
        </H3>
        <BasicTable tableData={englandIndicatorData} />
      </StyleChartWrapper>
    </section>
  );
}
