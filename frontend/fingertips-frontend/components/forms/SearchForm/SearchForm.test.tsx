import { render, screen } from '@testing-library/react';
import { SearchForm } from '.';

test('snapshot test - renders the form', () => {
  const container = render(
    <SearchForm />
  )

  expect(container.asFragment()).toMatchSnapshot();
});

test('should have an input field to input the indicatorId', () => {
  render(<SearchForm />);

  expect(screen.getByTestId('input-indicator-search')).toBeInTheDocument();
});
