import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/forms/SearchForm';

test('snapshot test - renders the form', () => {
  const container = render(
    <SearchForm indicator='' />
  )

  expect(container.asFragment()).toMatchSnapshot();
});

test('should have an input field to input the indicatorId', () => {
  render(<SearchForm indicator='' />);

  expect(screen.getByTestId('input-indicator-search')).toBeInTheDocument();
});
