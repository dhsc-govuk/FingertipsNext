import {
  getLatestHealthDataPointForEngland,
  TwoOrMoreIndicatorsEnglandViewPlots,
} from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots/index';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { render, screen } from '@testing-library/react';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

const mockSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: [areaCodeForEngland],
};
const mockEnglandHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: [
    {
      year: 2008,
      count: 222,
      value: 890.305692,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      ageBand: allAgesAge,
      sex: personsSex,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
  ],
};

const mockNoHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: [],
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
    areaHealthData: [mockNoHealthData],
  },
];

const mockIndicatorMetaData = [
  {
    indicatorID: '4444',
    indicatorName: 'mockIndicator',
    indicatorDefinition: '',
    dataSource: '',
    earliestDataPeriod: '',
    latestDataPeriod: '2008',
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

  describe('getLatestHealthDataPointForEngland', () => {
    it('should return the latest health data point when there is healthData', async () => {
      const result = getLatestHealthDataPointForEngland(
        mockIndicatorData[0],
        mockIndicatorMetaData[0].latestDataPeriod
      );
      expect(result).toEqual(mockEnglandHealthData.healthData[0]);
    });

    it('should return undefined when there is no healthData', async () => {
      const result = getLatestHealthDataPointForEngland(
        mockIndicatorData[1],
        ''
      );
      expect(result).toEqual(undefined);
    });
  });
});
