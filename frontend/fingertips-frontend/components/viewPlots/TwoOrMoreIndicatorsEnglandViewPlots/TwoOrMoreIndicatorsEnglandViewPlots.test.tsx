import {
  getEnglandIndicatorTableData,
  getLatestPeriodHealthDataPoint,
  TwoOrMoreIndicatorsEnglandViewPlots,
} from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots/index';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { render, screen } from '@testing-library/react';
import { healthDataPoint } from '@/lib/mocks';

const mockSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: [areaCodeForEngland],
};
const mockEnglandHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: [healthDataPoint],
};

const mockIndicatorData: IndicatorWithHealthDataForArea[] = [
  {
    indicatorId: 1,
    name: 'indicator 1',
    polarity: IndicatorPolarity.Unknown,
    benchmarkMethod: BenchmarkComparisonMethod.Unknown,
    areaHealthData: [mockEnglandHealthData],
  },
  {
    indicatorId: 2,
    name: 'indicator 2',
    polarity: IndicatorPolarity.Unknown,
    benchmarkMethod: BenchmarkComparisonMethod.Unknown,
    areaHealthData: [],
  },
];

const mockIndicatorMetaData = [
  {
    indicatorID: '1',
    indicatorName: 'indicator 1',
    indicatorDefinition: '',
    dataSource: '',
    earliestDataPeriod: '',
    latestDataPeriod: '2006',
    lastUpdatedDate: new Date(),
    associatedAreaCodes: [''],
    hasInequalities: false,
    unitLabel: '%',
    usedInPoc: false,
  },

  {
    indicatorID: '2',
    indicatorName: 'indicator 2',
    indicatorDefinition: '',
    dataSource: '',
    earliestDataPeriod: '',
    latestDataPeriod: '',
    lastUpdatedDate: new Date(),
    associatedAreaCodes: [''],
    hasInequalities: false,
    unitLabel: '',
    usedInPoc: false,
  },
];

describe('TwoOrMoreIndicatorsEnglandView', () => {
  it('should render the EnglandAreaTypeTable component', () => {
    render(
      <TwoOrMoreIndicatorsEnglandViewPlots
        searchState={mockSearchParams}
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockIndicatorMetaData}
      />
    );

    expect(
      screen.getByTestId('twoOrMoreIndicatorsEnglandViewPlot-component')
    ).toBeInTheDocument();
  });

  describe('getLatestPeriodHealthDataPoint', () => {
    it('should return the latest health data point when there is healthData', async () => {
      const result = getLatestPeriodHealthDataPoint(
        mockIndicatorData[0],
        mockIndicatorMetaData[0].latestDataPeriod
      );
      expect(result).toEqual(mockEnglandHealthData.healthData[0]);
    });

    it('should return undefined when there is no healthData', async () => {
      const result = getLatestPeriodHealthDataPoint(mockIndicatorData[1], '');
      expect(result).toEqual(undefined);
    });
  });

  describe('getEnglandIndicatorTableData', () => {
    it('should return table data with values when there is health data and return undefined in value fields when the there is no health data', () => {
      const result = getEnglandIndicatorTableData(
        mockIndicatorData,
        mockIndicatorMetaData
      );

      expect(result).toEqual([
        {
          indicatorId: 1,
          indicatorName: 'indicator 1',
          latestEnglandHealthData: mockEnglandHealthData.healthData[0],
          period: '2006',
          unitLabel: '%',
        },
        {
          indicatorId: 2,
          indicatorName: 'indicator 2',
          latestEnglandHealthData: undefined,
          period: undefined,
          unitLabel: undefined,
        },
      ]);
    });
  });
});
