import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { IndicatorSearchFormState } from './searchActions';
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
    <IndicatorSearchForm searchFormState={initialState} />
  );

  expect(container.asFragment()).toMatchSnapshot();
});

it('should have an input field to input the indicatorId', () => {
  render(<IndicatorSearchForm searchFormState={initialState} />);

  expect(screen.getByTestId('search-form-input-indicator')).toBeInTheDocument();
});

it('should set the input field with indicator value from the form state', () => {
  const searchFormState: IndicatorSearchFormState = {
    indicator: 'test value',
    message: '',
    errors: {},
  };
  render(<IndicatorSearchForm searchFormState={searchFormState} />);

  expect(screen.getByRole('searchbox')).toHaveValue('test value');
});
