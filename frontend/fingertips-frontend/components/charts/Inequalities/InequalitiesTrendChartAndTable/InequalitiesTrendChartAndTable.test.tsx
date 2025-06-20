// MUST BE AT THE TOP DUE TO JEST HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockGetIsLoading } from '@/mock/utils/mockLoadingUseState';
//
import { screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
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
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockDeprivationData } from '@/mock/data/mockDeprivationData';

mockGetIsLoading.mockReturnValue(false);
mockUsePathname.mockReturnValue('some-mock-path');

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
  {
    year: 2004,
    sex: male,
    isAggregate: false,
    deprivation: mockDeprivationData({
      type: 'Unitary deciles',
      isAggregate: false,
    }),
  },
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
      screen.getByText(/Inequalities data over time/i)
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
    const testInsufficientData = mockIndicatorWithHealthDataForArea({
      areaHealthData: [
        mockHealthDataForArea({
          healthData: mockHealthDataPoints([
            testPointOverrides[0],
            testPointOverrides[1],
            testPointOverrides[2],
            testPointOverrides[3],
          ]),
        }),
      ],
    });
    await testRender(testInsufficientData);

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });
});
