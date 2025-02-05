import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IndicatorSearchFormState } from './indicatorSearchActions';
import { IndicatorSearchForm } from '.';

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

const initialState: IndicatorSearchFormState = {
  indicator: '',
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

  expect(screen.getByTestId('indicator-search-form-input')).toBeInTheDocument();
});

it('should set the input field with indicator value from the form state', () => {
  const searchFormState: IndicatorSearchFormState = {
    indicator: 'test value',
    message: '',
    errors: {},
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  expect(screen.getByRole('searchbox')).toHaveValue('test value');
});

it('should display no message when there is no error', () => {
  const searchFormState: IndicatorSearchFormState = {
    indicator: 'test value',
    message: '',
    errors: {},
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  expect(
    screen.queryByTestId('indicator-search-form-error')
  ).not.toBeInTheDocument();
});

it('should display an error message when there is an error', () => {
  const searchFormState: IndicatorSearchFormState = {
    indicator: 'test value',
    message: 'error message',
    errors: {},
  };
  render(<IndicatorSearchForm indicatorSearchFormState={searchFormState} />);

  expect(
    screen.queryByTestId('indicator-search-form-error')
  ).toBeInTheDocument();
});
