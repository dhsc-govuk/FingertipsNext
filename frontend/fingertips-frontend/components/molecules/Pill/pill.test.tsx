import { render, screen } from '@testing-library/react';
import { Pill } from '.';

describe('Pill Suite', () => {
  it('should render expected elements', () => {
    render(<Pill selectedFilterName="Dementia" />);

    expect(screen.getByTestId('main-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.getByTestId('remove-icon-div')).toBeInTheDocument();
    expect(screen.getByRole('paragraph')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should render text passed in as prop', () => {
    render(<Pill selectedFilterName="Dementia" />);

    expect(screen.getByRole('paragraph')).toHaveTextContent('Dementia');
  });

  it('snapshot test', () => {
    const container = render(<Pill selectedFilterName="Dementia" />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
