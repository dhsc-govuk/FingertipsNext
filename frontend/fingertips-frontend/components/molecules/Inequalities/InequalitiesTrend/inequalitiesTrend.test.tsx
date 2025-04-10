import { render, screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesTrend } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, maleSex, noDeprivation } from '@/lib/mocks';

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

const state: SearchStateParams = {
  [SearchParams.InequalityLineChartTypeSelected]: 'Sex',
};

describe('InequalitiesTrend suite', () => {
  it('should render expected elements', async () => {
    const inequalitiesOptions = ['Sex', 'Unitary deciles'];
    const mockHealthData: HealthDataForArea[] = [
      {
        ...MOCK_HEALTH_DATA[1],
        healthData: [
          ...MOCK_HEALTH_DATA[1].healthData,
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
      },
    ];
    render(
      <InequalitiesTrend
        healthIndicatorData={mockHealthData}
        searchState={state}
      />
    );

    const inequalitiesTypesDropDown = screen.getByRole('combobox', {
      name: 'Select an inequality type',
    });
    const inequalitiesDropDownOptions = within(
      inequalitiesTypesDropDown
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
    inequalitiesDropDownOptions.forEach((option, index) => {
      expect(option.textContent).toBe(inequalitiesOptions[index]);
    });
  });

  it('should not render component if inequalities data is absent', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: MOCK_HEALTH_DATA[0].healthData.slice(0, 2),
    };

    render(
      <InequalitiesTrend
        healthIndicatorData={[mockHealthData]}
        searchState={state}
      />
    );

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });

  it('should not render component if inequalities data has less than 2 data points', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: [MOCK_HEALTH_DATA[0].healthData[0]],
    };

    render(
      <InequalitiesTrend
        healthIndicatorData={[mockHealthData]}
        searchState={state}
      />
    );

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });
});
