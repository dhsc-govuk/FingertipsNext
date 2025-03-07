import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';
import { SearchFormState } from './searchActions';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';

const mockPath = 'some path';
jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');
  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: jest.fn(),
    })),
  };
});

const mockSearchState: SearchStateParams = {};

const initialDataState: SearchFormState = {
  indicator: 'indicator',
  searchState: JSON.stringify(mockSearchState),
  message: null,
  errors: {},
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    set: jest.fn(),
  }),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SearchForm', () => {
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

  it('should pre-populate the indicator input field with value from the form state', () => {
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

  it('should render the select areas filter panel ', () => {
    render(<SearchForm formState={initialDataState} />);

    expect(screen.getByTestId('select-areas-filter-panel')).toBeInTheDocument();
  });
});
