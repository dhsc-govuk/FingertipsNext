import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesTrend } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';

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
  [SearchParams.AreasSelected]: ['A1245'],
};

describe('InequalitiesTrend suite', () => {
  it('should render expected elements', async () => {
    render(
      <InequalitiesTrend
        healthIndicatorData={MOCK_HEALTH_DATA}
        searchState={state}
      />
    );

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
