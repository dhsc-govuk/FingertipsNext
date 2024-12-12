import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';
import { SearchFormState } from './searchActions';
import { registryWrapper } from '@/lib/testutils';

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');

  return {
    ...originalModule,
    useActionState: jest
      .fn()
      .mockImplementation(
        (
          _: (
            formState: SearchFormState,
            formData: FormData
          ) => Promise<SearchFormState>,
          initialState: SearchFormState
        ) => [initialState, '/action']
      ),
  };
});

const initialState: SearchFormState = {
  indicator: '',
  message: null,
  errors: {},
};

test('snapshot test - renders the form', () => {
  const container = render(
    registryWrapper(<SearchForm searchFormState={initialState} />)
  );

  expect(container.asFragment()).toMatchSnapshot();
});

test('should have an input field to input the indicatorId', () => {
  render(registryWrapper(<SearchForm searchFormState={initialState} />));

  expect(screen.getByTestId('search-form-input-indicator')).toBeInTheDocument();
});
test('should display the error summary component when there is a validation error', () => {
  const errorState: SearchFormState = {
    indicator: '',
    message: 'Error message',
    errors: {},
  };

  render(registryWrapper(<SearchForm searchFormState={errorState} />));

  expect(screen.getByTestId('search-form-error-summary')).toBeInTheDocument();
});
