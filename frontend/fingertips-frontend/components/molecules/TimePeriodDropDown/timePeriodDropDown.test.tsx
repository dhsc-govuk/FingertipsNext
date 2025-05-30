import { render, screen, within } from '@testing-library/react';
import { TimePeriodDropDown } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { SearchStateContext } from '@/context/SearchStateContext';
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

const mockSetIsLoading = jest.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: mockSetIsLoading,
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
  [SearchParams.InequalityYearSelected]: '2023',
};

const years = ['2023', '2022', '2021', '2020'];

describe('TimePeriodDropDown suite', () => {
  it('should display expected elements', () => {
    render(<TimePeriodDropDown years={years} searchState={mockSearchState} />);
    const dropDown = screen.getByRole('combobox');
    const yearOptions = within(dropDown).getAllByRole('option');

    expect(dropDown).toBeInTheDocument();
    expect(dropDown).toHaveLength(4);
    yearOptions.forEach((option, index) => {
      expect(option.textContent).toBe(years[index]);
    });
    expect(screen.getByText(/Select a time period/i)).toBeInTheDocument();
  });

  it('should add selected year to the url when an option is selected', async () => {
    const expectedPath = [
      mockPath,
      `?${SearchParams.InequalityYearSelected}=2022`,
    ].join('');

    const user = userEvent.setup();
    render(<TimePeriodDropDown years={years} searchState={mockSearchState} />);

    await user.selectOptions(screen.getByRole('combobox'), '2022');

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should reset the state of inequalityType and inequalityArea selected params when an option is selected', async () => {
    const expectedPath = [
      mockPath,
      `?${SearchParams.InequalityYearSelected}=2022`,
    ].join('');

    const user = userEvent.setup();
    render(
      <TimePeriodDropDown
        years={years}
        searchState={{
          ...mockSearchState,
          [SearchParams.InequalityBarChartTypeSelected]: 'some type',
          [SearchParams.InequalityBarChartAreaSelected]: 'A001',
        }}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), '2022');

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });
});
