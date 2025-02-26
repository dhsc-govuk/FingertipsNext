import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { Inequalities } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

describe('Inequalities suite', () => {
  it('should render inequalities component', () => {
    render(<Inequalities healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(screen.getByTestId('inequalities-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesSexTable-component')
    ).toBeInTheDocument();
  });
});
