// MUST BE AT THE TOP DUE TO JEST HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
//
import { render, screen, within } from '@testing-library/react';
import { InequalitiesTypesDropDown } from './index';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';

const mockPath = 'some-mock-path';
mockUsePathname.mockReturnValue(mockPath);
const mockSearchState = {
  [SearchParams.InequalityLineChartTypeSelected]: 'Sex',
  [SearchParams.InequalityBarChartTypeSelected]: 'Sex',
};
mockUseSearchStateParams.mockReturnValue(mockSearchState);

describe('InequalitiesTypesDropDown', () => {
  const options = ['deprivation1', 'deprivation2', 'deprivation3', 'Sex'];

  it('should display expected elements', () => {
    render(
      <InequalitiesTypesDropDown
        inequalitiesOptions={options}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityBarChartTypeSelected
        }
        testRef="bc"
      />
    );
    const dropDown = screen.getByRole('combobox');
    const inequalitiesOptions = within(dropDown).getAllByRole('option');

    expect(screen.getByText(/Select an inequality type/i)).toBeInTheDocument();
    expect(dropDown).toBeInTheDocument();
    expect(dropDown).toHaveLength(options.length);
    inequalitiesOptions.forEach((option, index) => {
      expect(option.textContent).toBe(options[index]);
    });
  });

  it('should add selected inequality type to the url when an option is selected', async () => {
    const spy = jest.spyOn(window.history, 'pushState');
    const expectedPath = [
      mockPath,
      `?${SearchParams.InequalityLineChartTypeSelected}=deprivation2&${SearchParams.InequalityBarChartTypeSelected}=Sex`,
    ].join('');

    render(
      <InequalitiesTypesDropDown
        inequalitiesOptions={options}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityLineChartTypeSelected
        }
        testRef="lc"
      />
    );

    await userEvent.selectOptions(screen.getByRole('combobox'), 'deprivation2');

    expect(spy).toHaveBeenCalledWith(null, '', expectedPath);
  });

  it('should select option specified in searchState', async () => {
    mockSearchState[SearchParams.InequalityLineChartTypeSelected] =
      'deprivation3';

    render(
      <InequalitiesTypesDropDown
        inequalitiesOptions={options}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityLineChartTypeSelected
        }
        testRef="bc"
      />
    );

    const dropDown = screen.getByRole('combobox');
    expect(dropDown).toHaveDisplayValue('deprivation3');
  });
});
