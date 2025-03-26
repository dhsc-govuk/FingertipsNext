import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';
import { SearchFormState } from './searchActions';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { LoaderContext } from '@/context/LoaderContext';
import userEvent from '@testing-library/user-event';
import { ClientStorage, ClientStorageKeys } from '@/storage/clientStorage';

const mockPath = 'some path';
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
    useLoader: () => mockLoaderContext,
  };
});

const mockGetState = jest.fn();
const mockUpdateState = jest.fn();

ClientStorage.getState = mockGetState;
ClientStorage.updateState = mockUpdateState;

const mockSearchState: SearchStateParams = {};

const initialDataState: SearchFormState = {
  indicator: 'indicator',
  searchState: JSON.stringify(mockSearchState),
  message: null,
  errors: {},
};

describe('SearchForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('snapshot test - renders the form', () => {
    const container = render(
      <SearchForm formState={initialDataState} searchState={mockSearchState} />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should have an input field to input the indicatorId', () => {
    render(
      <SearchForm formState={initialDataState} searchState={mockSearchState} />
    );

    expect(
      screen.getByTestId('indicator-search-form-input')
    ).toBeInTheDocument();
  });

  it('should pre-populate the indicator input field with value from client storage if available', () => {
    mockGetState.mockReturnValue('value from client storage');

    const searchFormState: SearchFormState = {
      ...initialDataState,
    };
    render(
      <SearchForm formState={searchFormState} searchState={mockSearchState} />
    );

    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
      'value from client storage'
    );
  });

  it('should pre-populate the indicator input field with value from the form state if client storage has no value for searched indicator', () => {
    mockGetState.mockReturnValue(undefined);

    const searchFormState: SearchFormState = {
      ...initialDataState,
      indicator: 'test value',
    };
    render(
      <SearchForm formState={searchFormState} searchState={mockSearchState} />
    );

    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
      'test value'
    );
  });

  it('should update client storage with the typed searched indicator when focussing away from input field', async () => {
    const searchFormState: SearchFormState = {
      ...initialDataState,
      indicator: '',
    };
    render(
      <SearchForm formState={searchFormState} searchState={mockSearchState} />
    );

    const user = userEvent.setup();
    await user.type(
      screen.getByRole('textbox', { name: /indicator/i }),
      'hospital'
    );
    await user.click(screen.getByRole('textbox', { name: /area/i }));

    expect(mockUpdateState).toHaveBeenCalledWith(
      ClientStorageKeys.searchedIndicator,
      'hospital'
    );
  });

  it('should not update client storage with the searchIndicator when its the same value as in the state', async () => {
    const searchFormState: SearchFormState = {
      ...initialDataState,
      indicator: 'hospital',
    };
    render(
      <SearchForm
        formState={searchFormState}
        searchState={{
          [SearchParams.SearchedIndicator]: 'hospital',
        }}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('textbox', { name: /indicator/i }));
    await user.click(screen.getByRole('textbox', { name: /area/i }));

    expect(mockUpdateState).not.toHaveBeenCalledWith();
  });

  it('should pre-populate the area search field with the selected group area name when group area selected is ALL', () => {
    const searchState = {
      [SearchParams.GroupSelected]: eastEnglandNHSRegion.code,
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    };

    const searchFormState: SearchFormState = {
      ...initialDataState,
      indicator: 'test value',
      searchState: JSON.stringify(searchState),
    };

    render(
      <SearchForm
        formState={searchFormState}
        searchState={searchState}
        areaFilterData={{
          availableGroups: Object.values(mockAreaDataForNHSRegion),
        }}
      />
    );

    expect(screen.getByRole('textbox', { name: /area/i })).toHaveValue(
      eastEnglandNHSRegion.name
    );
  });

  it('should pre-populate the area search field with the first value for selectedAreasData', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
    };

    const searchFormState: SearchFormState = {
      ...initialDataState,
      indicator: 'test value',
      searchState: JSON.stringify(searchState),
    };

    render(
      <SearchForm
        formState={searchFormState}
        searchState={searchState}
        selectedAreasData={[eastEnglandNHSRegion, londonNHSRegion]}
      />
    );

    expect(screen.getByRole('textbox', { name: /area/i })).toHaveValue(
      eastEnglandNHSRegion.name
    );
  });

  it('should not render the selected areas panel when there are no areasSelected', () => {
    render(
      <SearchForm
        formState={initialDataState}
        searchState={{
          [SearchParams.AreasSelected]: undefined,
        }}
      />
    );

    expect(
      screen.queryByTestId('selected-areas-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the selected areas panel when there are areasSelected', () => {
    render(
      <SearchForm
        formState={initialDataState}
        searchState={{
          [SearchParams.AreasSelected]: ['E40000007'],
        }}
      />
    );

    expect(screen.getByTestId('selected-areas-panel')).toBeInTheDocument();
  });

  it('should render the select areas filter panel', () => {
    render(<SearchForm formState={initialDataState} />);

    expect(screen.getByTestId('select-areas-filter-panel')).toBeInTheDocument();
  });

  it('should render the select area filter panel as visible when state from storage to display panel is true', () => {
    mockGetState.mockReturnValue(true);

    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.getByTestId('select-areas-filter-panel-label')
    ).toHaveAttribute('open');
  });

  it('should not render the select area filter panel as visible when state from storage to display panel is false', () => {
    mockGetState.mockReturnValue(false);

    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.getByTestId('select-areas-filter-panel-label')
    ).not.toHaveAttribute('open');
  });

  it('should update the value in storage when the select areas filter panel label is clicked', async () => {
    render(<SearchForm formState={initialDataState} />);

    const user = userEvent.setup();
    await user.click(screen.getByText('Filter by area'));

    expect(mockUpdateState).toHaveBeenCalledWith(
      ClientStorageKeys.AreaFilterHomePage,
      true
    );
  });

  it('should call setIsLoading to true when the search button is clicked', async () => {
    render(<SearchForm formState={initialDataState} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });
});
