'use client';

import {
  SpineChartTableProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { noDeprivation } from '@/lib/mocks';

export const mapToSpineChartTableProps = (): SpineChartTableProps => {
  const mockIndicatorData = [
    {
      indicatorId: 2,
      title: 'Test indicator 1',
      definition: '',
    },
    {
      indicatorId: 1,
      title: 'Test indicator 2',
      definition: '',
    },
  ];

  const mockUnits = ['kg', 'per 1000'];

  const mockHealthData = [
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 2008,
          count: 222,
          value: 890.305692,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 2024,
          count: 111,
          value: 690.305692,
          lowerCi: 341.69151,
          upperCi: 478.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  const mockGroup = [
    {
      areaCode: '90210',
      areaName: 'Manchester',
      healthData: [
        {
          year: 2008,
          count: 111,
          value: 980.305692,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: '90210',
      areaName: 'Manchester',
      healthData: [
        {
          year: 2024,
          count: 3333,
          value: 690.305692,
          lowerCi: 341.69151,
          upperCi: 478.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  const mockBest = [1666, 22];

  const mockWorst = [959, 100];

  const data: SpineChartTableProps = {
    indicators: mockIndicatorData,
    measurementUnits: mockUnits,
    indicatorHealthData: mockHealthData,
    groupIndicatorData: mockGroup,
    englandBenchmarkData: MOCK_HEALTH_DATA,
    worst: mockWorst,
    best: mockBest,
  };

  return data;
};

export function TwoOrMoreIndicatorsAreasViewPlot() {
  const spineTableData = mapToSpineChartTableProps();

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <SpineChartTable
        indicators={spineTableData.indicators}
        measurementUnits={spineTableData.measurementUnits}
        indicatorHealthData={spineTableData.indicatorHealthData}
        groupIndicatorData={spineTableData.groupIndicatorData}
        englandBenchmarkData={spineTableData.englandBenchmarkData}
        best={spineTableData.best}
        worst={spineTableData.worst}
      />
    </section>
  );
}
