import { render, screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesForSingleTimePeriod } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { SearchStateContext } from '@/context/SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, noDeprivation, maleSex } from '@/lib/mocks';
import { LoaderContext } from '@/context/LoaderContext';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: jest.fn(),
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockSearchStateContext: SearchStateContext = {
  getSearchState: jest.fn(),
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

const mockSearchState = {
  [SearchParams.InequalityYearSelected]: '2008',
};

describe('InequalitiesForSingleTimePeriod suite', () => {
  it('should render expected elements', async () => {
    const years = ['2008', '2004'];
    const inequalitiesOptions = ['Sex', 'Unitary deciles'];
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: [
        ...MOCK_HEALTH_DATA[0].healthData,
        {
          year: 2008,
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: maleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
          isAggregate: false,
        },
        {
          year: 2008,
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: maleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: {
            ...noDeprivation,
            isAggregate: false,
            type: 'Unitary deciles',
          },
          isAggregate: false,
        },
      ],
    };

    render(
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={[mockHealthData]}
        searchState={mockSearchState}
        dataSource={'inequalities data source'}
      />
    );

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
      screen.getByText(/Inequalities data for a single time period/i)
    ).toBeInTheDocument();

    expect(timePeriodDropDown).toBeInTheDocument();
    expect(timePeriodDropDown).toHaveLength(2);
    yearOptions.forEach((option, index) => {
      expect(option.textContent).toBe(years[index]);
    });

    expect(inequalitiesTypesDropDown).toBeInTheDocument();
    expect(inequalitiesDropDownOptions).toHaveLength(2);
    inequalitiesDropDownOptions.forEach((option, index) => {
      expect(option.textContent).toBe(inequalitiesOptions[index]);
    });

    expect(inequalitiesAreasDropDown).toBeInTheDocument();
    expect(inequalitiesAreasDropDownOptions).toHaveLength(1);
    inequalitiesAreasDropDownOptions.forEach((option) => {
      expect(option.textContent).toBe(MOCK_HEALTH_DATA[0].areaName);
    });

    expect(
      screen.getAllByText('Data source: inequalities data source')
    ).toHaveLength(2);
  });

  it('should not render component if inequalities data is absent', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: MOCK_HEALTH_DATA[0].healthData.slice(0, 2),
    };

    render(
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={[mockHealthData]}
        searchState={mockSearchState}
      />
    );

    expect(
      screen.queryByTestId('inequalitiesForSingleTimePeriod-component')
    ).not.toBeInTheDocument();
  });
});
