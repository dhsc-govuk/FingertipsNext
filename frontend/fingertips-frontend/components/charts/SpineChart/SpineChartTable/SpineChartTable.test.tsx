import { render, screen } from '@testing-library/react';

import { SpineChartTable } from './SpineChartTable';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
import { SpineChartIndicatorData } from '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData';

describe('Spine chart table suite', () => {
  // Greater Manchester ICB - 00T
  const selectedAreaOne = 'A1425';
  const selectedAreaTwo = 'A1426';

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
            year: mismatchedYears ? 2022 : 2023,
            count: 222,
            value: 690.305692,
            lowerCi: 341.69151,
            upperCi: 478.32766,
            ageBand: allAgesAge,
            sex: personsSex,
            trend: HealthDataPointTrendEnum.CannotBeCalculated,
            deprivation: noDeprivation,
            benchmarkComparison: {
              outcome: BenchmarkOutcome.Similar,
            },
          },
        ],
      },
    ];
  };

  const mockGroup: HealthDataForArea = {
    areaCode: '90210',
    areaName: 'Manchester',
    healthData: [
      {
        year: 2023,
        count: 3333,
        value: 890.305692,
        lowerCi: 341.69151,
        upperCi: 478.32766,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ],
  };

  const mockEngland: HealthDataForArea = {
    ...mockGroup,
    areaCode: areaCodeForEngland,
    areaName: englandAreaString,
  };

  const mockBenchmarkStatistics = [
    {
      indicatorId: 1,
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 1666,
      q1Value: 1000,
      q2Value: 969,
      q3Value: 959,
      q4Value: 920,
      englandValue: 1010.5623,
    },
    {
      indicatorId: 2,
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 22,
      q1Value: 40,
      q2Value: 60,
      q3Value: 100,
      q4Value: 124,
      englandValue: 61.5,
    },
  ];

  const mockIndicatorData: SpineChartIndicatorData[] = [
    {
      rowId: '1',
      indicatorId: 1,
      indicatorName: 'testIndicator1',
      latestDataPeriod: 2023,
      valueUnit: '%',
      areasHealthData: getMockHealthData(),
      groupData: mockGroup,
      englandData: mockEngland,
      quartileData: mockBenchmarkStatistics[0],
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    },
    {
      rowId: '2',
      indicatorId: 2,
      indicatorName: 'testIndicator2',
      latestDataPeriod: 2023,
      valueUnit: 'per 100,000',
      areasHealthData: getMockHealthData(),
      groupData: mockGroup,
      englandData: mockEngland,
      quartileData: mockBenchmarkStatistics[1],
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    },
  ];

  describe('Spine chart table', () => {
    it('should render the SpineChartTable component with title', () => {
      render(
        <SpineChartTable
          indicatorData={mockIndicatorData}
          benchmarkToUse={areaCodeForEngland}
        />
      );
      const spineChart = screen.getByTestId('spineChartTable-component');
      expect(spineChart).toBeInTheDocument();

      const titles = screen.getAllByRole('heading', { level: 4 });
      expect(titles[0]).toHaveTextContent(
        'Area profile for Greater Manchester ICB - 00T'
      );
      expect(titles[1]).toHaveTextContent('Compared to England');
    });

    it('should render the SpineChartTable in ascending indicator order', () => {
      render(
        <SpineChartTable
          indicatorData={mockIndicatorData}
          benchmarkToUse={areaCodeForEngland}
        />
      );

      const indicators = screen.getAllByTestId(`indicator-cell`);
      expect(indicators[0]).toHaveTextContent('testIndicator1');
      expect(indicators[1]).toHaveTextContent('testIndicator2');
    });
  });

  describe('Spine Chart with 2 areas', () => {
    const mockTwoAreasIndicatorData: SpineChartIndicatorData[] = [
      {
        rowId: '1-persons',
        indicatorId: 1,
        indicatorName: 'testIndicator1',
        latestDataPeriod: 2023,
        valueUnit: '%',
        areasHealthData: getMockHealthData().concat(
          getMockHealthData(selectedAreaTwo)
        ),
        groupData: mockGroup,
        englandData: mockEngland,
        quartileData: mockBenchmarkStatistics[0],
        benchmarkComparisonMethod:
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      },
      {
        rowId: '2-persons',
        indicatorId: 2,
        indicatorName: 'testIndicator1',
        latestDataPeriod: 2023,
        valueUnit: 'per 100,000',
        areasHealthData: getMockHealthData().concat(
          getMockHealthData(selectedAreaTwo)
        ),
        groupData: mockGroup,
        englandData: mockEngland,
        quartileData: mockBenchmarkStatistics[1],
        benchmarkComparisonMethod:
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      },
    ];

    it('should display nothing if indicatorData is empty', () => {
      const { container } = render(
        <SpineChartTable
          indicatorData={[]}
          benchmarkToUse={areaCodeForEngland}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should display data correctly for both areas', () => {
      render(
        <SpineChartTable
          indicatorData={mockTwoAreasIndicatorData}
          benchmarkToUse={areaCodeForEngland}
        />
      );

      const titles = screen.getAllByRole('heading', { level: 4 });
      expect(titles[0]).toHaveTextContent(
        'Area profile for Greater Manchester ICB - 00T and Greater Manchester ICB - 01T'
      );

      expect(screen.getByTestId('area-header-1')).toHaveTextContent(
        'Greater Manchester ICB - 00T'
      );
      expect(screen.getByTestId('area-header-2')).toHaveTextContent(
        'Greater Manchester ICB - 01T'
      );
      expect(screen.getAllByTestId('area-1-count-cell')[1]).toHaveTextContent(
        '222'
      );
      expect(screen.getAllByTestId('area-1-value-cell')[1]).toHaveTextContent(
        '690.3'
      );
      expect(screen.getAllByTestId('area-2-count-cell')[1]).toHaveTextContent(
        '222'
      );
      expect(screen.getAllByTestId('area-2-value-cell')[1]).toHaveTextContent(
        '690.3'
      );

      // Trend data should not be displayed
      expect(screen.queryByTestId('trend-cell')).not.toBeInTheDocument();
    });

    it("should render an 'X' when second area does not have data for latest period of the first area", () => {
      const mockDataPeriodMismatch = [...mockTwoAreasIndicatorData];
      mockDataPeriodMismatch[0].areasHealthData = getMockHealthData().concat(
        getMockHealthData(selectedAreaTwo, true)
      );

      render(
        <SpineChartTable
          indicatorData={mockDataPeriodMismatch}
          benchmarkToUse={areaCodeForEngland}
        />
      );

      expect(screen.getByTestId('area-header-1')).toHaveTextContent(
        'Greater Manchester ICB - 00T'
      );
      expect(screen.getByTestId('area-header-2')).toHaveTextContent(
        'Greater Manchester ICB - 01T'
      );

      expect(screen.getAllByTestId('area-1-count-cell')[0]).toHaveTextContent(
        '222'
      );
      expect(screen.getAllByTestId('area-1-value-cell')[0]).toHaveTextContent(
        '690.3'
      );
      expect(screen.getAllByTestId('area-2-count-cell')[0]).toHaveTextContent(
        'X'
      );
      expect(screen.getAllByTestId('area-2-value-cell')[0]).toHaveTextContent(
        'X'
      );
    });
  });
});
