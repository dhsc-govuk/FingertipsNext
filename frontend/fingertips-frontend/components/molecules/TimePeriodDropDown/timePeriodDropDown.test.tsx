import { render, screen, within } from '@testing-library/react';
import { TimePeriodDropDown } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { LoaderContext } from '@/context/LoaderContext';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSetIsLoading = vi.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: mockSetIsLoading,
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const years = ['2023', '2022', '2021', '2020'];

describe('TimePeriodDropDown suite', () => {
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

  it('should add selected year to the url when an option is selected', async () => {
    const expectedPath = [
      mockPath,
      `?${SearchParams.AreaTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupSelected}=${areaCodeForEngland}`,
      `&${SearchParams.InequalityYearSelected}=2022`,
    ].join('');

    const user = userEvent.setup();
    render(<TimePeriodDropDown years={years} />);

    await user.selectOptions(screen.getByRole('combobox'), '2022');

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should reset the state of inequalityType and inequalityArea selected params when an option is selected', async () => {
    const expectedPath = [
      mockPath,
      `?${SearchParams.AreaTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupSelected}=${areaCodeForEngland}`,
      `&${SearchParams.InequalityYearSelected}=2022`,
    ].join('');

    const user = userEvent.setup();
    render(<TimePeriodDropDown years={years} />);

    await user.selectOptions(screen.getByRole('combobox'), '2022');

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });
});
