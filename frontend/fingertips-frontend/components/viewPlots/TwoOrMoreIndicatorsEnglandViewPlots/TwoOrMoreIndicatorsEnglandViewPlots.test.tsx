import {
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
import {  healthDataPoint } from '@/lib/mocks';

const mockSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: [areaCodeForEngland],
};
const mockEnglandHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: [
    healthDataPoint
  ],
};

const mockIndicatorData: IndicatorWithHealthDataForArea[] = [
  {
    indicatorId: 1,
    name: ' ',
    polarity: IndicatorPolarity.Unknown,
    benchmarkMethod: BenchmarkComparisonMethod.Unknown,
    areaHealthData: [mockEnglandHealthData],
  },
  {
    indicatorId: 2,
    name: ' ',
    polarity: IndicatorPolarity.Unknown,
    benchmarkMethod: BenchmarkComparisonMethod.Unknown,
    areaHealthData: [],
  },
];

const mockIndicatorMetaData = [
  {
    indicatorID: '4444',
    indicatorName: 'mockIndicator',
    indicatorDefinition: '',
    dataSource: '',
    earliestDataPeriod: '',
    latestDataPeriod: '2006',
    lastUpdatedDate: new Date(),
    associatedAreaCodes: [''],
    hasInequalities: false,
    unitLabel: '',
    usedInPoc: false,
  },

  {
    indicatorID: '5555',
    indicatorName: 'mockIndicator',
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
      const result = getLatestPeriodHealthDataPoint(
        mockIndicatorData[1],
        ''
      );
      expect(result).toEqual(undefined);
    });
  });
});
