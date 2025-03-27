import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { TwoOrMoreIndicatorsAreasViewPlot } from '.';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { render, screen } from '@testing-library/react';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { noDeprivation } from '@/lib/mocks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const indicatorIds = ['123', '321'];
const mockAreas = ['A001'];
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
      ageBand: 'All',
      sex: 'All',
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
      ageBand: 'All',
      sex: 'All',
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
        ageBand: 'All',
        sex: 'All',
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
        ageBand: 'All',
        sex: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ],
  },
];

const mockIndicatorData: IndicatorWithHealthDataForArea[] = [
  {
    areaHealthData: [
      mockAreaHealthData[0],
      mockGroupHealthData,
      mockEnglandHealthData,
    ],
  },
  {
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

describe('TwoOrMoreIndicatorsAreasViewPlots', () => {
  it('should render the view with correct title', async () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        searchState={mockSearchParams}
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
      />
    );

    const heading = await screen.findByRole('heading', { level: 2 });

    expect(
      screen.getByTestId('twoOrMoreIndicatorsAreasViewPlot-component')
    ).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the SpineChartTable components', async () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        searchState={mockSearchParams}
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
      />
    );
    expect(screen.getByTestId('spineChartTable-component')).toBeInTheDocument();
  });
});
