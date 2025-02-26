import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';
import { SearchFormState } from './searchActions';
import { SearchStateParams } from '@/lib/searchStateManager';

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
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
  usePathname: jest.fn(),
}));

const setupUI = (initialState: SearchFormState | null = null) => {
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
    useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
  }));

  if (initialState == null) {
    initialState = initialDataState;
  }
  const container = render(
    <SearchForm formState={initialState} searchState={mockSearchState} />
  );

  return { container };
};
it('snapshot test - renders the form', () => {
  const { container } = setupUI();
  expect(container.asFragment()).toMatchSnapshot();
});

it('should have an input field to input the indicatorId', () => {
  setupUI();
  expect(screen.getByTestId('indicator-search-form-input')).toBeInTheDocument();
});

it('should set the input field with indicator value from the form state', () => {
  const indicatorState: SearchFormState = {
    indicator: 'test value',
    areaSearched: 'test area',
    message: '',
    errors: {},
  };
  setupUI(indicatorState);

  expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
    'test value'
  );

  expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
    'test value'
  );
});
