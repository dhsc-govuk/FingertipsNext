import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';
import { SearchFormState } from './searchActions';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

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
  areaSearched: 'area',
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

  it('should set the input field with indicator value from the form state', () => {
    const indicatorState: SearchFormState = {
      indicator: 'test value',
      areaSearched: 'test area',
      message: '',
      errors: {},
    };
    render(
      <SearchForm formState={indicatorState} searchState={mockSearchState} />
    );

    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
      'test value'
    );

    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
      'test value'
    );
  });

  it('should not render the selected areas panel when there are areasSelected', () => {
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
