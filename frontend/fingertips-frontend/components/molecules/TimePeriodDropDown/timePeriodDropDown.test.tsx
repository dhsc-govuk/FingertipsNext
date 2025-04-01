import { render, screen, within } from '@testing-library/react';
import { TimePeriodDropDown } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
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

const mockSearchState = {
  [SearchParams.InequalityYearSelected]: '2023',
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

const years = ['2023', '2022', '2021', '2020'];

describe('TimePeriodDropDown suite', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue(mockSearchState);
  });

  it('should display expected elements', () => {
    render(<TimePeriodDropDown years={years} />);
    const dropDown = screen.getByRole('combobox');
    const yearOptions = within(dropDown).getAllByRole('option');

    expect(dropDown).toBeInTheDocument();
    expect(dropDown).toHaveLength(4);
    yearOptions.forEach((option, index) => {
      expect(option.textContent).toBe(years[index]);
    });
    expect(screen.getByText(/Select a time period/i)).toBeInTheDocument();
  });

  it('should add selected year to the url', async () => {
    const expectedPath = [
      mockPath,
      `?${SearchParams.InequalityYearSelected}=2022`,
    ].join('');

    const user = userEvent.setup();
    render(<TimePeriodDropDown years={years} />);

    await user.selectOptions(screen.getByRole('combobox'), '2022');

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });
});
