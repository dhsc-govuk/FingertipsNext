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

const initialState: SearchFormState = {
  indicator: '',
  areaSearched: '',
  message: null,
  errors: {},
};

it('snapshot test - renders the form', () => {
  const container = render(<SearchForm searchFormState={initialState} />);

  expect(container.asFragment()).toMatchSnapshot();
});

it('should have an input field to input the indicatorId', () => {
  render(<SearchForm searchFormState={initialState} />);

  expect(screen.getByTestId('search-form-input-indicator')).toBeInTheDocument();
});

it('should have an input field to input the area by location or organisation', () => {
  render(<SearchForm searchFormState={initialState} />);

  expect(screen.getByTestId('search-form-input-area')).toBeInTheDocument();
});

it('should set the input field with indicator value from the form state', () => {
  const indicatorState: SearchFormState = {
    indicator: 'test value',
    areaSearched: '',
    message: '',
    errors: {},
  };
  render(<SearchForm searchFormState={indicatorState} />);

  expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
    'test value'
  );
});

it('should display the filter by area link', () => {
  render(<SearchForm searchFormState={initialState} />);
  const link = screen.getByTestId('search-form-link-filter-area');
  expect(link).toBeInTheDocument();
})
