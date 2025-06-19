import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IndicatorSearchFormState } from './indicatorSearchActions';
import { IndicatorSearchForm } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { LoaderContext } from '@/context/LoaderContext';
import userEvent from '@testing-library/user-event';
import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');

  return {
    ...originalModule,
    useActionState: jest
      .fn()
      .mockImplementation(
        (
          _: (
            formState: IndicatorSearchFormState,
            formData: FormData
          ) => Promise<IndicatorSearchFormState>,
          initialState: IndicatorSearchFormState
        ) => [initialState, '/action']
      ),
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

const mockIndicatorValue = 'test value';
const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockIndicatorValue,
};
jest.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => searchState,
}));

const initialState: IndicatorSearchFormState = {
  searchState: JSON.stringify(searchState),
  indicator: mockIndicatorValue,
  message: null,
  errors: {},
};

it('snapshot test - renders the form', () => {
  const container = render(
    <IndicatorSearchForm indicatorSearchFormState={initialState} />
  );

  expect(container.asFragment()).toMatchSnapshot();
});

it('should have an input field to input the indicatorId', () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  expect(screen.getByRole('searchbox')).toBeInTheDocument();
});

it('should set the input field with indicator value from the form state', () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  expect(screen.getByRole('searchbox')).toHaveValue(mockIndicatorValue);
});

it('should call setIsLoading with true when the search button is clicked', async () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  const user = userEvent.setup();
  await user.click(screen.getByRole('button'));

  expect(mockSetIsLoading).toHaveBeenCalledWith(true);
});

it('should display no message when there is no error', () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  expect(
    screen.queryByTestId('indicator-search-form-error')
  ).not.toBeInTheDocument();
});

it('should display an error message when there is an error', () => {
  const searchFormState: IndicatorSearchFormState = {
    ...initialState,
    message: 'error message',
    errors: {},
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  expect(
    screen.queryByTestId('indicator-search-form-error')
  ).toBeInTheDocument();
});

it('should not display character if indicator is under the 75% threshold', () => {
  const searchFormState: IndicatorSearchFormState = {
    ...initialState,
    indicator: 'A'.repeat(INDICATOR_SEARCH_MAX_CHARACTERS * 0.75),
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  expect(
    screen.queryByText('You have 50 characters remaining.', { exact: false })
  ).not.toBeInTheDocument();
});

it('should display character count if indicator is over the 75% threshold', () => {
  const searchFormState: IndicatorSearchFormState = {
    ...initialState,
    indicator: 'A'.repeat(INDICATOR_SEARCH_MAX_CHARACTERS * 0.75 + 1),
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  expect(
    screen.getByText('You have 49 characters remaining.')
  ).toBeInTheDocument();
});

it('should update character count on change', async () => {
  const searchFormState: IndicatorSearchFormState = {
    ...initialState,
    indicator: 'A'.repeat(INDICATOR_SEARCH_MAX_CHARACTERS * 0.75),
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  const user = userEvent.setup();

  await user.type(screen.getByRole('searchbox'), 'A');

  expect(
    screen.getByText('You have 49 characters remaining.')
  ).toBeInTheDocument();
});
