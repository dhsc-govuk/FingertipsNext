import { act, render, screen, waitFor } from '@testing-library/react';
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
import { GovukColours } from '@/lib/styleHelpers/colours';

const mockPath = 'some path';
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

let mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const initialDataState: SearchFormState = {
  indicator: 'indicator',
  searchState: JSON.stringify(mockSearchState),
  message: null,
  errors: {},
};

describe('SearchForm', () => {
  beforeEach(() => {
    mockSearchState = {};
  });

  afterEach(() => {
    vi.clearAllMocks();
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

    mockSearchState = searchState;

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
    mockSearchState = {
      [SearchParams.AreasSelected]: undefined,
    };

    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.queryByTestId('selected-areas-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the selected areas panel when there are areasSelected', () => {
    mockSearchState = {
      [SearchParams.AreasSelected]: ['E40000007'],
    };

    render(<SearchForm formState={initialDataState} />);

    expect(screen.getByTestId('selected-areas-panel')).toBeInTheDocument();
  });

  it('should not render the select areas filter panel by default', () => {
    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.queryByTestId('select-areas-filter-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the select areas filter panel when open areas expander is expanded', async () => {
    render(<SearchForm formState={initialDataState} />);
    act(() => screen.getByText('Open area filter').click());

    await waitFor(() => {
      expect(
        screen.getByTestId('select-areas-filter-panel')
      ).toBeInTheDocument();
    });
  });

  it('should call setIsLoading with true when the search buttons are clicked', async () => {
    render(<SearchForm formState={initialDataState} />);

    const user = userEvent.setup();
    const buttons = screen.queryAllByRole('button');

    for (const button of buttons) {
      await user.click(button);
    }

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should display no message when there is no error and a black border around the input field', () => {
    render(<SearchForm formState={initialDataState} />);

    expect(
      screen.queryByTestId('indicator-search-form-error')
    ).not.toBeInTheDocument();

    const input = screen.getByTestId('indicator-search-form-input');
    expect(input).toHaveStyle(`border-color: ${GovukColours.Black}`);
  });

  it('should show error message and a red border around the input field when the formState message is set', () => {
    render(
      <SearchForm
        formState={{ ...initialDataState, message: 'Error', indicator: '' }}
      />
    );

    expect(
      screen.getByTestId('indicator-search-form-error')
    ).toBeInTheDocument();

    const input = screen.getByTestId('indicator-search-form-input');
    expect(input).toHaveStyle(`border-color: ${GovukColours.Red}`);
  });
});
