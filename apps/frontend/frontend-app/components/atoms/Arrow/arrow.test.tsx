import { Arrow } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { Direction } from '@/lib/common-types';

describe('Arrow Suite', () => {
  it('should display right arrow', () => {
    render(<Arrow direction={Direction.RIGHT} />);

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
  });

  it('should display up arrow', () => {
    render(<Arrow direction={Direction.UP} />);

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
  });

  it('should display down arrow', () => {
    render(<Arrow direction={Direction.DOWN} />);

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
  });

  it('should use the default stroke colour when not provided', () => {
    const defaultColour = '#000000';

    render(<Arrow direction={Direction.DOWN} />);
    expect(screen.getByTestId('arrow-icon').getAttribute('stroke')).toEqual(
      defaultColour
    );
  });

  it('should use the stroke colour provided by client when present', () => {
    const requestedColour = '#270D0B';

    render(<Arrow direction={Direction.DOWN} strokeColour={requestedColour} />);
    expect(screen.getByTestId('arrow-icon').getAttribute('stroke')).toEqual(
      requestedColour
    );
  });

  it('snapshot test', () => {
    const container = render(<Arrow direction={Direction.UP} />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
