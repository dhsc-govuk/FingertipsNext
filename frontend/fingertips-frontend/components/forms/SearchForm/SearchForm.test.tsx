import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';
import { SearchFormState } from './searchActions';

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

test('snapshot test - renders the form', () => {
  const container = render(<SearchForm indicator="" />);

  expect(container.asFragment()).toMatchSnapshot();
});

test('should have an input field to input the indicatorId', () => {
  render(<SearchForm indicator="" />);

  expect(screen.getByTestId('search-form-input-indicator')).toBeInTheDocument();
});
