// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockGetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
//
import { act, render, screen, within } from '@testing-library/react';
import { InequalitiesBarChartAndTable } from './InequalitiesBarChartAndTable';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { QueryClient } from '@tanstack/query-core';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { QueryClientProvider } from '@tanstack/react-query';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { mockDeprivationData } from '@/mock/data/mockDeprivationData';

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
  const queryClient = new QueryClient();
  const inequalitiesParams = inequalitiesRequestParams(mockSearchState);
  const inequalitiesQueryKey = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    inequalitiesParams
  );
  queryClient.setQueryData([inequalitiesQueryKey], testHealthData);
  queryClient.setQueryData(['/indicator/41101'], mockIndicatorDocument());
  await act(() =>
    render(
      <QueryClientProvider client={queryClient}>
        <InequalitiesBarChartAndTable />
      </QueryClientProvider>
    )
  );
};

const male = { value: 'Male', isAggregate: false };
const female = { value: 'Female', isAggregate: false };
const testPointOverrides = [
  { year: 2008 },
  {
    year: 2008,
    sex: male,
    isAggregate: false,
    deprivation: mockDeprivationData({
      type: 'Unitary deciles',
      isAggregate: false,
    }),
  },
  { year: 2008, sex: female, isAggregate: false },
  { year: 2004 },
  { year: 2004, sex: male, isAggregate: false },
  { year: 2004, sex: female, isAggregate: false },
];
const testData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      healthData: mockHealthDataPoints(testPointOverrides),
    }),
  ],
});

describe('InequalitiesBarChartAndTable', () => {
  beforeEach(() => {});

  it('should render expected elements', async () => {
    const years = ['2008', '2004'];
    const inequalitiesOptions = ['Sex', 'Unitary deciles'];

    await testRender(testData);

    const timePeriodDropDown = screen.getByRole('combobox', {
      name: 'Select a time period',
    });
    const yearOptions = within(timePeriodDropDown).getAllByRole('option');

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
      screen.getByTestId('inequalitiesBarChartTable-component')
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('inequalitiesBarChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesBarChartAndTable')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Inequalities data for a single time period/)
    ).toBeInTheDocument();

    expect(timePeriodDropDown).toBeInTheDocument();
    expect(timePeriodDropDown).toHaveLength(2);
    const yearsInOptions = yearOptions.map((option) => option.textContent);
    expect(yearsInOptions).toEqual(years);

    expect(inequalitiesTypesDropDown).toBeInTheDocument();
    expect(inequalitiesDropDownOptions).toHaveLength(2);
    const inequalitiesInOptions = inequalitiesDropDownOptions.map(
      (option) => option.textContent
    );
    expect(inequalitiesInOptions).toEqual(inequalitiesOptions);

    expect(inequalitiesAreasDropDown).toBeInTheDocument();
    expect(inequalitiesAreasDropDownOptions).toHaveLength(1);
    const areasInOptions = inequalitiesAreasDropDownOptions.map(
      (option) => option.textContent
    );
    const areasInTestData = testData.areaHealthData?.map(
      ({ areaName }) => areaName
    );

    expect(areasInOptions).toEqual(areasInTestData);

    expect(screen.getAllByText('Data source: NHS England')).toHaveLength(2);
  });

  it('should not render component if inequalities data is absent', async () => {
    const testDataWithoutInequalities = mockIndicatorWithHealthDataForArea();
    await testRender(testDataWithoutInequalities);

    expect(
      screen.queryByTestId('inequalitiesForSingleTimePeriod-component')
    ).not.toBeInTheDocument();
  });
});
