import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { TwoOrMoreIndicatorsAreasViewPlot } from '.';
import {
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { render, screen } from '@testing-library/react';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const indicatorIds = ['123', '321'];
const mockAreas = ['A001', 'A002', 'A003'];
const mockGroupArea = 'G001';

const mockSearchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: indicatorIds,
  [SearchParams.AreasSelected]: mockAreas,
  [SearchParams.GroupSelected]: mockGroupArea,
};

const mockGroupHealthData: HealthDataForArea = {
  areaCode: mockGroupArea,
  areaName: 'Group',
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

const mockAreaHealthData: HealthDataForArea[] = [
  {
    areaCode: mockAreas[0],
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
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ],
  },
  {
    areaCode: mockAreas[0],
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
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ],
  },
];

const mockIndicatorData: IndicatorWithHealthDataForArea[] = [
  {
    indicatorId: Number(indicatorIds[0]),
    areaHealthData: [
      mockAreaHealthData[0],
      mockGroupHealthData,
      mockEnglandHealthData,
    ],
  },
  {
    indicatorId: Number(indicatorIds[1]),
    areaHealthData: [
      mockAreaHealthData[1],
      mockGroupHealthData,
      mockEnglandHealthData,
    ],
  },
];

const mockMetaData = [
  {
    indicatorID: indicatorIds[0],
    indicatorName: 'pancakes eaten',
    indicatorDefinition: 'number of pancakes consumed',
    dataSource: 'BJSS Leeds',
    earliestDataPeriod: '2025',
    latestDataPeriod: '2025',
    lastUpdatedDate: new Date('March 4, 2025'),
    associatedAreaCodes: [mockAreas[0]],
    unitLabel: 'pancakes',
    hasInequalities: true,
    usedInPoc: false,
  },
  {
    indicatorID: indicatorIds[1],
    indicatorName: 'pizzas eaten',
    indicatorDefinition: 'number of pizzas consumed',
    dataSource: 'BJSS Leeds',
    earliestDataPeriod: '2023',
    latestDataPeriod: '2023',
    lastUpdatedDate: new Date('March 4, 2023'),
    associatedAreaCodes: [mockAreas[0]],
    unitLabel: 'pizzas',
    hasInequalities: true,
    usedInPoc: false,
  },
];

const mockBenchmarkStatistics = [
  {
    indicatorId: Number(indicatorIds[0]),
    polarity: IndicatorPolarity.LowIsGood,
    q0Value: 0,
    q1Value: 1,
    q3Value: 3,
    q4Value: 4,
  },
  {
    indicatorId: Number(indicatorIds[1]),
    polarity: IndicatorPolarity.LowIsGood,
    q0Value: 4,
    q1Value: 3,
    q3Value: 1,
    q4Value: 0,
  },
];

describe('TwoOrMoreIndicatorsAreasViewPlots', () => {
  it('should render all components with up to 2 areas selected', () => {
    const areas = [mockAreas[0], mockAreas[1]];
    mockSearchParams[SearchParams.AreasSelected] = areas;

    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        searchState={mockSearchParams}
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockBenchmarkStatistics}
      />
    );
    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(screen.getByTestId('spineChartTable-component')).toBeInTheDocument();
  });
  it('should not render the spine chart component with more than 2 areas selected', () => {
    const areas = [mockAreas[0], mockAreas[1], mockAreas[2]];
    mockSearchParams[SearchParams.AreasSelected] = areas;

    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        searchState={mockSearchParams}
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockBenchmarkStatistics}
      />
    );
    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('spineChartTable-component')
    ).not.toBeInTheDocument();
  });
});
