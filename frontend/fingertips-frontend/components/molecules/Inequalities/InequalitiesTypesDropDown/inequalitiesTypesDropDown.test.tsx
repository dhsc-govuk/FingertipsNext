import { render, screen, within } from '@testing-library/react';
import { InequalitiesTypesDropDown } from '.';
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
  [SearchParams.InequalityLineChartTypeSelected]: 'Sex',
  [SearchParams.InequalityBarChartTypeSelected]: 'Sex',
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

describe('InequalitiesTypesDropDown suite', () => {
  const options = ['deprivation1', 'deprivation2', 'deprivation3', 'Sex'];
  beforeEach(() => {
    mockGetSearchState.mockReturnValue(mockSearchState);
  });

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
    const expectedPath = [
      mockPath,
      `?${SearchParams.InequalityLineChartTypeSelected}=deprivation2&${SearchParams.InequalityBarChartTypeSelected}=Sex`,
    ].join('');

    const user = userEvent.setup();
    render(
      <InequalitiesTypesDropDown
        inequalitiesOptions={options}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityLineChartTypeSelected
        }
        testRef="lc"
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), 'deprivation2');

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should select option specified in searchState', async () => {
    const mockSearchState = {
      [SearchParams.InequalityLineChartTypeSelected]: 'deprivation3',
    };

    mockGetSearchState.mockReturnValue(mockSearchState);

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
