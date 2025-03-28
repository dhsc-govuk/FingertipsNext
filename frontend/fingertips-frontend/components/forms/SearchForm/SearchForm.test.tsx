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
import { SearchStateContext } from '@/context/SearchStateContext';

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
    useLoadingState: () => mockLoaderContext,
  };
});

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

const mockSearchState: SearchStateParams = {};

const initialDataState: SearchFormState = {
  indicator: 'indicator',
  searchState: JSON.stringify(mockSearchState),
  message: null,
  errors: {},
};

describe('SearchForm', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue(mockSearchState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('snapshot test - renders the form', () => {
    const container = render(<SearchForm formState={initialDataState} />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should have an input field to input the indicatorId', () => {
    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.getByTestId('indicator-search-form-input')
    ).toBeInTheDocument();
  });

  it('should pre-populate the area search field with the selected group area name when group area selected is ALL', () => {
    const searchState = {
      [SearchParams.GroupSelected]: eastEnglandNHSRegion.code,
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    };

    mockGetSearchState.mockReturnValue(searchState);

    const searchFormState: SearchFormState = {
      ...initialDataState,
      indicator: 'test value',
      searchState: JSON.stringify(searchState),
    };

    render(
      <SearchForm
        formState={searchFormState}
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
        selectedAreasData={[eastEnglandNHSRegion, londonNHSRegion]}
      />
    );

    expect(screen.getByRole('textbox', { name: /area/i })).toHaveValue(
      eastEnglandNHSRegion.name
    );
  });

  it('should not render the selected areas panel when there are no areasSelected', () => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreasSelected]: undefined,
    });

    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.queryByTestId('selected-areas-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the selected areas panel when there are areasSelected', () => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreasSelected]: ['E40000007'],
    });

    render(<SearchForm formState={initialDataState} />);

    expect(screen.getByTestId('selected-areas-panel')).toBeInTheDocument();
  });

  it('should render the select areas filter panel', () => {
    render(<SearchForm formState={initialDataState} />);

    expect(screen.getByTestId('select-areas-filter-panel')).toBeInTheDocument();
  });

  it('should call setIsLoading with true when the search button is clicked', async () => {
    render(<SearchForm formState={initialDataState} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });
});
