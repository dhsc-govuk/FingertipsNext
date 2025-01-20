import { Arrow } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { Direction } from '@/lib/common-types';

describe('Arrow Suite', () => {
  it('should render expected elements', () => {
    render(<Arrow direction={Direction.UP} />);

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
  });

  describe('should display arrow based on direction prop', () => {
    it('should display right arrow', () => {
      render(<Arrow direction={Direction.RIGHT} />);

      expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    });

    it('should display up arrow', () => {
      render(<Arrow direction={Direction.UP} />);

      expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
    });

    it('should display down arrow', () => {
      render(<Arrow direction={Direction.DOWN} />);

      expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
    });
  });

  it('snapshot test', () => {
    const container = render(<Arrow direction={Direction.UP} />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
