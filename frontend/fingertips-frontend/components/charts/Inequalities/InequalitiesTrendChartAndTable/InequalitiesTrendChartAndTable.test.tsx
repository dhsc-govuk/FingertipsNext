// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockGetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
//
import { screen, within } from '@testing-library/react';
import {
  DatePeriod,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { InequalitiesTrendChartAndTable } from '@/components/charts/Inequalities/InequalitiesTrendChartAndTable/InequalitiesTrendChartAndTable';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import {
  mockHealthDataPoint,
  mockHealthDataPoints,
} from '@/mock/data/mockHealthDataPoint';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockDeprivationData } from '@/mock/data/mockDeprivationData';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';
import { deepClone } from '@vitest/utils';

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

  await testRenderQueryClient(<InequalitiesTrendChartAndTable />, seedData);
};

const male = { value: 'Male', isAggregate: false };
const female = { value: 'Female', isAggregate: false };

const year2008: DatePeriod = mockDatePeriod(2008);
const year2004: DatePeriod = mockDatePeriod(2004);

const testData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      healthData: undefined,
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: [
            mockHealthDataPoint({
              datePeriod: year2008,
            }),
            mockHealthDataPoint({
              datePeriod: year2004,
            }),
          ],
        }),
        mockIndicatorSegment({
          sex: male,
          healthData: [
            mockHealthDataPoint({
              datePeriod: year2008,
              deprivation: mockDeprivationData({
                type: 'Unitary deciles',
                isAggregate: false,
              }),
            }),
            mockHealthDataPoint({
              datePeriod: year2004,
              deprivation: mockDeprivationData({
                type: 'Unitary deciles',
                isAggregate: false,
              }),
            }),
          ],
        }),
        mockIndicatorSegment({
          sex: female,
          healthData: mockHealthDataPoints([2008, 2004]),
        }),
      ],
    }),
  ],
});

describe('InequalitiesTrendChart', () => {
  it('should render expected elements', async () => {
    const inequalitiesOptions = ['Sex', 'Unitary deciles'];

    await testRender(testData);

    const inequalitiesTypesDropDown = screen.getByRole('combobox', {
      name: 'Select an inequality type',
    });
    const inequalitiesDropDownOptions = within(
      inequalitiesTypesDropDown
    ).getAllByRole('option');

    const inequalitiesAreasDropDown = screen.getByRole('combobox', {
      name: 'Select an area',
    });
    const inequalitiesAreasDropDownOptions = within(
      inequalitiesAreasDropDown
    ).getAllByRole('option');

    expect(
      screen.getByTestId('inequalitiesLineChartTable-component')
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('inequalitiesLineChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesLineChartAndTable')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        chartTitleConfig[ChartTitleKeysEnum.InequalitiesLineChart].title
      )
    ).toBeInTheDocument();

    expect(inequalitiesTypesDropDown).toBeInTheDocument();
    expect(inequalitiesDropDownOptions).toHaveLength(2);

    const inequalitiesInDropDown = inequalitiesDropDownOptions.map(
      (option) => option.textContent
    );
    expect(inequalitiesInDropDown).toEqual(inequalitiesOptions);

    expect(inequalitiesAreasDropDown).toBeInTheDocument();
    expect(inequalitiesAreasDropDownOptions).toHaveLength(1);

    const areasInDropDown = inequalitiesAreasDropDownOptions.map(
      (option) => option.textContent
    );
    expect(areasInDropDown).toEqual([testData.areaHealthData?.at(0)?.areaName]);

    expect(screen.getAllByText('Data source: NHS England')).toHaveLength(2);
  });

  it('should not render component if inequalities data is absent', async () => {
    await testRender(mockIndicatorWithHealthDataForArea());

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });

  it('should not render component if inequalities data has less than 2 data points', async () => {
    const testInsufficientData = deepClone(testData);
    testInsufficientData.areaHealthData
      ?.at(0)
      ?.indicatorSegments?.at(1)
      ?.healthData?.splice(1);
    testInsufficientData.areaHealthData?.at(0)?.indicatorSegments?.splice(2);

    await testRender(testInsufficientData);

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });
});
