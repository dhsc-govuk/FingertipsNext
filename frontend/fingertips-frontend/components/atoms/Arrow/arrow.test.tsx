import { render, screen } from '@testing-library/react';
import { Arrow } from './index';
import { Direction } from '@/lib/common-types';

// filepath: frontend/fingertips-frontend/components/atoms/Arrow/index.test.tsx

describe('Arrow Component', () => {
  it('snapshot test', () => {
    const container = render(<Arrow direction={Direction.UP} />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with default props', () => {
    render(<Arrow direction={Direction.UP} />);
    const arrowIcon = screen.getByTestId('arrow-icon');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon).toHaveAttribute('stroke', '#000000'); // Default stroke color
  });

  it('applies the correct rotation for Direction.UP', () => {
    render(<Arrow direction={Direction.UP} />);
    const arrowGroup = screen.getByTestId('arrow-up').closest('g');
    expect(arrowGroup).toHaveAttribute('transform', 'rotate(0)');
  });

  it('applies the correct rotation for Direction.RIGHT', () => {
    render(<Arrow direction={Direction.RIGHT} />);
    const arrowGroup = screen.getByTestId('arrow-right').closest('g');
    expect(arrowGroup).toHaveAttribute('transform', 'rotate(90 10 10)');
  });

  it('applies the correct rotation for Direction.DOWN', () => {
    render(<Arrow direction={Direction.DOWN} />);
    const arrowGroup = screen.getByTestId('arrow-down').closest('g');
    expect(arrowGroup).toHaveAttribute('transform', 'rotate(180 10 10)');
  });

  it('applies the correct rotation for Direction.LEFT', () => {
    render(<Arrow direction={Direction.LEFT} />);
    const arrowGroup = screen.getByTestId('arrow-left').closest('g');
    expect(arrowGroup).toHaveAttribute('transform', 'rotate(-90 10 10)');
  });

  it('applies the correct stroke color when strokeColour is provided', () => {
    const customColor = '#FF5733';
    render(<Arrow direction={Direction.UP} strokeColour={customColor} />);
    const arrowIcon = screen.getByTestId('arrow-icon');
    expect(arrowIcon).toHaveAttribute('stroke', customColor);
  });
});
