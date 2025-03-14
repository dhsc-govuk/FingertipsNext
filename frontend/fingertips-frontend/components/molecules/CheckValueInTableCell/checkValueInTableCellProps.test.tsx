import { render, screen } from '@testing-library/react';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell/index';
import React from 'react';

describe('CheckValueInTableCell', () => {
  const renderWithTableComponent = (component: React.ReactNode) => {
    return render(
      <table>
        <tbody>
          <tr>{component}</tr>
        </tbody>
      </table>
    );
  };

  it('should return the value if its present and is not 0', () => {
    renderWithTableComponent(<CheckValueInTableCell value={42} />);
    expect(screen.getByText(42)).toBeInTheDocument();
    expect(screen.getByText(42)).not.toHaveAttribute('aria-label');
  });

  it('should render value 0 and not set aria-label', () => {
    renderWithTableComponent(<CheckValueInTableCell value={0} />);
    expect(screen.getByText(0)).toBeInTheDocument();
    expect(screen.getByText(0)).not.toHaveAttribute('aria-label');
  });

  it('should render X and set aria-label, when value is undefined', () => {
    renderWithTableComponent(<CheckValueInTableCell value={undefined} />);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('X')).toHaveAttribute('aria-label', 'Not compared');
  });
});
