import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { RowData } from './SpineChartTableRow';
import { mapToSpineChartTableData, SpineChartTable } from '.';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

describe('Spine chart table suite', () => {
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

  const mockUnits = ['kg', 'per 1,000'];

  const mockHealthData: HealthDataForArea[] = [
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
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
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
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  const mockGroup: HealthDataForArea[] = [
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
          ageBand: allAgesAge,
          sex: personsSex,
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
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  const mockBenchmarkStatistics = [
    {
      best: 1666,
      bestQuartile: 1000,
      worstQuartile: 969,
      worst: 959,
    },
    {
      best: 22,
      bestQuartile: 40,
      worstQuartile: 60,
      worst: 100,
    },
  ];

  const mockTableData = [
    {
      indicator: mockIndicatorData[0],
      measurementUnit: mockUnits[0],
      indicatorHealthData: mockHealthData[0],
      groupIndicatorData: mockGroup[0],
      englandBenchmarkData: MOCK_HEALTH_DATA[0],
      benchmarkStatistics: mockBenchmarkStatistics[0],
    },
    {
      indicator: mockIndicatorData[1],
      measurementUnit: mockUnits[1],
      indicatorHealthData: mockHealthData[1],
      groupIndicatorData: mockGroup[1],
      englandBenchmarkData: MOCK_HEALTH_DATA[1],
      benchmarkStatistics: mockBenchmarkStatistics[1],
    },
  ];

  describe('Spine chart table', () => {
    it('snapshot test - should match snapshot', () => {
      const container = render(<SpineChartTable rowData={mockTableData} />);
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the SpineChartTable component', () => {
      render(<SpineChartTable rowData={mockTableData} />);
      const spineChart = screen.getByTestId('spineChartTable-component');
      expect(spineChart).toBeInTheDocument();
    });

    it('should render the SpineChartTable in ascending indicator order', () => {
      render(<SpineChartTable rowData={mockTableData} />);

      const expectedIndicators = ['Test indicator 2', 'Test indicator 1'];
      const indictors = screen.getAllByTestId(`indicator-cell`);
      expect(indictors[0]).toHaveTextContent(expectedIndicators[0]);
      expect(indictors[1]).toHaveTextContent(expectedIndicators[1]);
    });
  });

  describe('mapToSpineChartTableData', () => {
    it('should map to spine chart table row data', () => {
      const expectedRowData: SpineChartTableRowData[] = [
        {
          benchmarkStatistics: {
            best: 1666,
            bestQuartile: 1000,
            worstQuartile: 969,
            worst: 959,
          },
          benchmarkValue: 890.305692,
          count: 222,
          groupValue: 980.305692,
          indicator: 'Test indicator 1',
          indicatorId: 2,
          period: 2008,
          trend: 'Increasing and getting worse',
          unit: 'kg',
          value: 890.305692,
        },
        {
          benchmarkStatistics: {
            best: 22,
            bestQuartile: 40,
            worstQuartile: 60,
            worst: 100,
          },
          benchmarkValue: 135.149304,
          count: 111,
          groupValue: 690.305692,
          indicator: 'Test indicator 2',
          indicatorId: 1,
          period: 2024,
          trend: 'Cannot be calculated',
          unit: 'per 1,000',
          value: 690.305692,
        },
      ];

      expect(mapToSpineChartTableData(mockTableData)).toEqual(expectedRowData);
    });
  });
});
