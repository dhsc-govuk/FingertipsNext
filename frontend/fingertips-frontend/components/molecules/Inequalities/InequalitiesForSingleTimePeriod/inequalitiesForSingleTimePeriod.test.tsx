import { render, screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesForSingleTimePeriod } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

const state: SearchStateParams = {
  [SearchParams.YearSelected]: '2008',
};

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

describe('InequalitiesForSingleTimePeriod suite', () => {
  it('should render expected elements', async () => {
    const years = ['2008', '2004'];

    render(
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={MOCK_HEALTH_DATA[0]}
        searchState={state}
      />
    );

    const dropDown = screen.getByRole('combobox');
    const yearOptions = within(dropDown).getAllByRole('option');

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
    expect(dropDown).toBeInTheDocument();
    expect(dropDown).toHaveLength(2);
    yearOptions.forEach((option, index) => {
      expect(option.textContent).toBe(years[index]);
    });
  });
});
