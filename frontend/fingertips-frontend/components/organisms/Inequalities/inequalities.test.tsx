import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { Inequalities } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { SearchStateContext } from '@/context/SearchStateContext';

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['333'],
  [SearchParams.AreasSelected]: ['A1245'],
};

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
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
  beforeEach(() => {
    mockGetSearchState.mockReturnValue(state);
  });

  it('should render inequalities component', async () => {
    render(<Inequalities healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

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

  it('should render expected text', () => {
    render(<Inequalities healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(
      screen.getByText(/Inequalities data for a single time period/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Inequalities data over time/i)
    ).toBeInTheDocument();
  });

  it('check if the measurement unit value "kg" is rendered correctly', () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        measurementUnit="kg"
      />
    );
    expect(screen.getByText('kg')).toBeInTheDocument();
  });
});
