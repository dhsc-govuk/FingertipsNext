import { expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
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

it('should set the input field with indicator value from the form state', () => {
  const indicatorState: SearchFormState = {
    indicator: 'test value',
    message: '',
    errors: {},
  };
  render(<SearchForm searchFormState={indicatorState} />);

  expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
    'test value'
  );
});

it('should display the error summary component when there is a validation error', () => {
  const errorState: SearchFormState = {
    indicator: '',
    message: 'Error message',
    errors: {},
  };

  render(<SearchForm searchFormState={errorState} />);

  expect(screen.getByTestId('search-form-error-summary')).toBeInTheDocument();
});

it('should display the error summary component when there is a validation error', async () => {
  // Add missing function to jsdom
  const scrollMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollMock;

  const user = userEvent.setup();

  const errorState: SearchFormState = {
    indicator: '',
    message: 'Error message',
    errors: {},
  };

  render(<SearchForm searchFormState={errorState} />);

  const anchor = screen.getByText('Indicator field').closest('a')!;

  await user.click(anchor);

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveFocus();
  });
  expect(scrollMock).toBeCalledTimes(1);
});
