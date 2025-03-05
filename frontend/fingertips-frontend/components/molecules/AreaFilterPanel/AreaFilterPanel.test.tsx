import { render, screen } from '@testing-library/react';
import { AreaAutoCompleteFilterPanel } from './index';

describe('AreaFilterPanel', () => {
  test('should render the link with the correct text when areas are not null', () => {
    render(<AreaAutoCompleteFilterPanel areas={['A001']} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Open a filter to add or change areas');
  });

  test('should render the link with default text when areas length is 0', () => {
    render(<AreaAutoCompleteFilterPanel areas={[]} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Open area filter');
  });
});
