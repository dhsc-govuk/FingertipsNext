import { render, screen } from '@testing-library/react';
import { RemoveIcon } from '.';

describe('Remove Icon Suite', () => {
  it('should render expected elements', () => {
    render(<RemoveIcon width="20" height="20" color="blue" />);

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should set attributes with props', () => {
    render(<RemoveIcon width="20" height="20" color="blue" />);

    expect(screen.getByTestId('x-icon')).toHaveAttribute('width', '20');
    expect(screen.getByTestId('x-icon')).toHaveAttribute('height', '20');
    expect(screen.getByTestId('x-icon')).toHaveAttribute('stroke', 'blue');
  });

  it('snapshot test', () => {
    const container = render(
      <RemoveIcon width="20" height="20" color="blue" />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
