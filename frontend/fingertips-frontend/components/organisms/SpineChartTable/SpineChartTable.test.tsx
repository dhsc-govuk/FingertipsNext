import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableRowData } from './SpineChartTableRow';
import { mapToSpineChartTableData, SpineChartTable } from '.';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
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

  // Greater Manchester ICB - 00T
  const selectedAreaOne = 'A1425';
  const selectedAreaTwo = 'A1426';

  const mockUnits = ['kg', 'per 1000'];

  const getMockHealthData = (
    selectedArea: string = selectedAreaOne,
    mismatchedYears: boolean = false
  ): HealthDataForArea[] => {
    const areaName = `Greater Manchester ICB - 0${selectedArea === selectedAreaOne ? '0' : '1'}T`;
    return [
      {
        areaCode: selectedArea,
        areaName: areaName,
        healthData: [
          {
            year: mismatchedYears ? 2023 : 2024,
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
        areaCode: selectedArea,
        areaName: areaName,
        healthData: [
          {
            year: 2022,
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
  };

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
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 1666,
      q1Value: 1000,
      q2Value: 969,
      q3Value: 959,
    },
    {
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 22,
      q1Value: 40,
      q2Value: 60,
      q3Value: 100,
    },
  ];

  const mockTableData = [
    {
      indicator: mockIndicatorData[0],
      measurementUnit: mockUnits[0],
      indicatorHealthDataAreaOne: getMockHealthData()[0],
      groupIndicatorData: mockGroup[0],
      englandBenchmarkData: MOCK_HEALTH_DATA[0],
      benchmarkStatistics: mockBenchmarkStatistics[0],
    },
    {
      indicator: mockIndicatorData[1],
      measurementUnit: mockUnits[1],
      indicatorHealthDataAreaOne: getMockHealthData()[1],
      groupIndicatorData: mockGroup[1],
      englandBenchmarkData: MOCK_HEALTH_DATA[1],
      benchmarkStatistics: mockBenchmarkStatistics[1],
    },
  ];

  describe('Spine chart table', () => {
    it('snapshot test - should match snapshot', () => {
      const container = render(
        <SpineChartTable
          rowData={mockTableData}
          areasSelected={[selectedAreaOne]}
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the SpineChartTable component', () => {
      render(
        <SpineChartTable
          rowData={mockTableData}
          areasSelected={[selectedAreaOne]}
        />
      );
      const spineChart = screen.getByTestId('spineChartTable-component');
      expect(spineChart).toBeInTheDocument();
    });

    it('should render the SpineChartTable in ascending indicator order', () => {
      render(
        <SpineChartTable
          rowData={mockTableData}
          areasSelected={[selectedAreaOne]}
        />
      );

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
            polarity: IndicatorPolarity.HighIsGood,
            q0Value: 1666,
            q1Value: 1000,
            q2Value: 969,
            q3Value: 959,
          },
          benchmarkValue: 890.305692,
          areaOneCount: 222,
          groupValue: 980.305692,
          indicator: 'Test indicator 1',
          indicatorId: 2,
          period: 2024,
          trend: 'Increasing and getting worse',
          unit: 'kg',
          areaOneValue: 890.305692,
          twoAreasRequested: false,
        },
        {
          benchmarkStatistics: {
            polarity: IndicatorPolarity.HighIsGood,
            q0Value: 22,
            q1Value: 40,
            q2Value: 60,
            q3Value: 100,
          },
          benchmarkValue: 135.149304,
          areaOneCount: 111,
          groupValue: 690.305692,
          indicator: 'Test indicator 2',
          indicatorId: 1,
          period: 2022,
          trend: 'Cannot be calculated',
          unit: 'per 1000',
          areaOneValue: 690.305692,
          twoAreasRequested: false,
        },
      ];

      expect(mapToSpineChartTableData(mockTableData, false)).toEqual(
        expectedRowData
      );
    });
  });

  describe('Spine Chart with 2 areas', () => {
    const mockTwoAreaTableData = [
      {
        indicator: mockIndicatorData[0],
        measurementUnit: mockUnits[0],
        indicatorHealthDataAreaOne: getMockHealthData()[0],
        indicatorHealthDataAreaTwo: getMockHealthData(selectedAreaTwo)[0],
        groupIndicatorData: mockGroup[0],
        englandBenchmarkData: MOCK_HEALTH_DATA[0],
        benchmarkStatistics: mockBenchmarkStatistics[0],
      },
      {
        indicator: mockIndicatorData[1],
        measurementUnit: mockUnits[1],
        indicatorHealthDataAreaOne: getMockHealthData()[1],
        indicatorHealthDataAreaTwo: getMockHealthData(selectedAreaTwo)[1],
        groupIndicatorData: mockGroup[1],
        englandBenchmarkData: MOCK_HEALTH_DATA[1],
        benchmarkStatistics: mockBenchmarkStatistics[1],
      },
    ];

    it('should match the snapshot - including data for both areas', () => {
      const container = render(
        <SpineChartTable
          rowData={mockTwoAreaTableData}
          areasSelected={[selectedAreaOne, selectedAreaTwo]}
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it("should render an 'X' when second area does not have data for latest period of the first area", () => {
      const mockDataPeriodMismatch = [...mockTwoAreaTableData];
      mockDataPeriodMismatch[0] = {
        ...mockTwoAreaTableData[0],
        indicatorHealthDataAreaTwo: getMockHealthData(selectedAreaTwo, true)[0],
      };

      render(
        <SpineChartTable
          rowData={mockDataPeriodMismatch}
          areasSelected={[selectedAreaOne, selectedAreaTwo]}
        />
      );

      expect(screen.getByTestId('area-header-1')).toHaveTextContent(
        'Greater Manchester ICB - 00T'
      );
      expect(screen.getByTestId('area-header-2')).toHaveTextContent(
        'Greater Manchester ICB - 01T'
      );

      // When sorted by indicator ID, the 2nd indicator has the period mismatch by area.
      expect(screen.getAllByTestId('area-1-count-cell')[1]).toHaveTextContent(
        '222'
      );
      expect(screen.getAllByTestId('area-1-value-cell')[1]).toHaveTextContent(
        '890.3'
      );
      expect(screen.getAllByTestId('area-2-count-cell')[1]).toHaveTextContent(
        'X'
      );
      expect(screen.getAllByTestId('area-2-value-cell')[1]).toHaveTextContent(
        'X'
      );
    });
  });
});
