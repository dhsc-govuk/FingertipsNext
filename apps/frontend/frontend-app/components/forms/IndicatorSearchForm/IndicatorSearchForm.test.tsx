import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IndicatorSearchFormState } from './indicatorSearchActions';
import { IndicatorSearchForm } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import userEvent from '@testing-library/user-event';

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

const mockIndicatorValue = 'test value';

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockIndicatorValue,
};

const initialState: IndicatorSearchFormState = {
  searchState: JSON.stringify(state),
  indicator: mockIndicatorValue,
  message: null,
  errors: {},
};

beforeEach(() => {
  mockGetSearchState.mockReturnValue(state);
});

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
