// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockGetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
//
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Inequalities } from './Inequalities';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

mockGetIsLoading.mockReturnValue(false);
mockUsePathname.mockReturnValue('some-mock-path');
mockHighChartsWrapperSetup();

const mockSearchState: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['41101'],
  [SearchParams.AreasSelected]: ['E12000002'],
  [SearchParams.AreaTypeSelected]: 'regions',
  [SearchParams.GroupTypeSelected]: 'england',
  [SearchParams.GroupSelected]: areaCodeForEngland,
};
mockUseSearchStateParams.mockReturnValue(mockSearchState);

const testRender = async (testHealthData: IndicatorWithHealthDataForArea) => {
  const inequalitiesParams = inequalitiesRequestParams(mockSearchState);
  const inequalitiesQueryKey = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    inequalitiesParams
  );
  const seedData: SeedData = {
    [inequalitiesQueryKey]: testHealthData,
    '/indicator/41101': mockIndicatorDocument(),
  };

  await testRenderQueryClient(<Inequalities />, seedData);
};

const male = { value: 'Male', isAggregate: false };
const female = { value: 'Female', isAggregate: false };
const testPointOverrides = [
  { year: 2022 },
  { year: 2022, sex: male, isAggregate: false },
  { year: 2022, sex: female, isAggregate: false },
  { year: 2021 },
  { year: 2021, sex: male, isAggregate: false },
  { year: 2021, sex: female, isAggregate: false },
];
const testData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea_England({
      healthData: mockHealthDataPoints(testPointOverrides),
    }),
    mockHealthDataForArea({
      healthData: mockHealthDataPoints(testPointOverrides),
    }),
  ],
});

describe('Inequalities', () => {
  it.each([
    'inequalities-component',
    'inequalitiesLineChartTable-component',
    'inequalitiesLineChart-component',
    'inequalitiesBarChartTable-component',
    'inequalitiesBarChart-component',
    'tabContainer-inequalitiesLineChartAndTable',
    'tabContainer-inequalitiesBarChartAndTable',
    'inequalitiesComparisonForOneTimePeriod-component',
    'inequalitiesTrend-component',
    'inequalitiesTypes-dropDown-component-bc',
    'inequalitiesTypes-dropDown-component-lc',
  ])('should render inequalities component: %s', async (testId) => {
    await testRender(testData);
    await userEvent.click(screen.getByText('Show inequalities data'));

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should render expected text', async () => {
    await testRender(testData);
    await userEvent.click(screen.getByText('Show inequalities data'));

    expect(
      screen.getByText(
        chartTitleConfig[ChartTitleKeysEnum.InequalitiesBarChart].title
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        chartTitleConfig[ChartTitleKeysEnum.InequalitiesLineChart].title
      )
    ).toBeInTheDocument();
  });

  it('should render the inequalities main title', async () => {
    await testRender(testData);
    expect(screen.getByText('Related inequalities data')).toBeInTheDocument();
  });

  it('should render the arrow expander and toggle the inequalities charts', async () => {
    await testRender(testData);
    const expander = screen.getByText('Show inequalities data');
    expect(expander).toBeInTheDocument();

    await userEvent.click(expander);
    expect(
      screen.getByTestId('inequalitiesLineChartTable-component')
    ).toBeInTheDocument();

    expect(screen.getByText('Hide inequalities data')).toBeInTheDocument();
    await userEvent.click(expander);
    expect(
      screen.queryByTestId('inequalitiesLineChartTable-component')
    ).not.toBeInTheDocument();
  });
});
