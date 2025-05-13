import { render, screen, waitFor } from '@testing-library/react';
import { expect } from '@jest/globals';
import { Inequalities } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { SearchStateContext } from '@/context/SearchStateContext';
import { LoaderContext } from '@/context/LoaderContext';

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['333'],
  [SearchParams.AreasSelected]: ['A1245'],
};

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

describe('Inequalities suite', () => {
  it('should render inequalities component', async () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA}
        searchState={state}
      />
    );

    await waitFor(async () => {
      expect(screen.getByTestId('inequalities-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('inequalitiesLineChartTable-component')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('inequalitiesLineChart-component')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('inequalitiesBarChartTable-component')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('inequalitiesBarChart-component')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabContainer-inequalitiesLineChartAndTable')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabContainer-inequalitiesBarChartAndTable')
      ).toBeInTheDocument();
    });
  });

  it('should render expected text', async () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA}
        searchState={state}
      />
    );

    expect(
      await screen.findByText(/Inequalities data for a single time period/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Inequalities data over time/i)
    ).toBeInTheDocument();
  });

  it('check if the measurement unit value "kg" is rendered correctly', async () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA}
        searchState={state}
        measurementUnit="kg"
      />
    );
    expect(await screen.findByText('kg')).toBeInTheDocument();
  });
});
