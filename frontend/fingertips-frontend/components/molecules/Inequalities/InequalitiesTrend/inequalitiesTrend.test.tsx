import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesTrend } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { SearchStateContext } from '@/context/SearchStateContext';

const state: SearchStateParams = {
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

describe('InequalitiesTrend suite', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue(state);
  });

  it('should render expected elements', async () => {
    render(
      <InequalitiesTrend
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
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
});
