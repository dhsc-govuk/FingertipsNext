import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IndicatorSearchFormState } from './indicatorSearchActions';
import { IndicatorSearchForm } from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { LoaderContext } from '@/context/LoaderContext';
import userEvent from '@testing-library/user-event';
import { ClientStorage, ClientStorageKeys } from '@/storage/clientStorage';

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
    useLoader: () => mockLoaderContext,
  };
});

const mockGetState = jest.fn();
const mockUpdateState = jest.fn();
ClientStorage.getState = mockGetState;
ClientStorage.updateState = mockUpdateState;

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

it('snapshot test - renders the form', () => {
  const container = render(
    <IndicatorSearchForm
      indicatorSearchFormState={initialState}
      searchState={state}
    />
  );

  expect(container.asFragment()).toMatchSnapshot();
});

it('should have an input field to input the indicatorId', () => {
  render(
    <IndicatorSearchForm
      indicatorSearchFormState={initialState}
      searchState={state}
    />
  );

  expect(screen.getByRole('searchbox')).toBeInTheDocument();
});

it('should set the input field with indicator value from the form state', () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  expect(screen.getByRole('searchbox')).toHaveValue(mockIndicatorValue);
});

it('should update client storage with the typed searched indicator when focussing away from input field', async () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  const user = userEvent.setup();
  await user.clear(screen.getByRole('searchbox'));
  await user.type(screen.getByRole('searchbox'), 'hospital');
  await user.tab();

  expect(mockUpdateState).toHaveBeenCalledWith(
    ClientStorageKeys.searchedIndicator,
    'hospital'
  );
});

it('should not update client storage with the searchIndicator when its the same value as in the state', async () => {
  render(<IndicatorSearchForm indicatorSearchFormState={initialState} />);

  const user = userEvent.setup();
  await user.click(screen.getByRole('searchbox'));
  await user.tab();

  expect(mockUpdateState).not.toHaveBeenCalledWith();
});

it('should call setIsLoading to true when the search button is clicked', async () => {
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
