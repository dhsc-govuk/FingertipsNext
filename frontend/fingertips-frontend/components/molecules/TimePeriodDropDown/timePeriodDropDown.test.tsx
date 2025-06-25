// MUST BE AT THE TOP
import { mockSetIsLoading } from '@/mock/utils/mockLoadingUseState';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
//
import { render, screen, within } from '@testing-library/react';
import { TimePeriodDropDown } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockPath = 'some-mock-path';

mockSetIsLoading.mockReturnValue(false);
mockUsePathname.mockReturnValue(mockPath);

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
    const spy = vi.spyOn(window.history, 'pushState');
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

    expect(spy).toHaveBeenCalledWith(null, '', expectedPath);
  });

  it('should reset the state of inequalityType and inequalityArea selected params when an option is selected', async () => {
    const spy = vi.spyOn(window.history, 'pushState');
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

    expect(spy).toHaveBeenCalledWith(null, '', expectedPath);
  });
});
