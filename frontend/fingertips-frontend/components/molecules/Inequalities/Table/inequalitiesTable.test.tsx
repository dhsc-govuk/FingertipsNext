import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesTable, InequalitiesSexTableHeadingsEnum } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

describe('Inequalities sex table suite', () => {
  const CELLS_PER_ROW = 4;
  it('should render the InequalitiesSexTable component', () => {
    render(<InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(
      screen.getByTestId('inequalitiesSexTable-component')
    ).toBeInTheDocument();
  });

  it('should render expected elements', () => {
    render(<InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
      MOCK_HEALTH_DATA[1].areaName
    );
    expect(screen.getAllByRole('cell')).toHaveLength(CELLS_PER_ROW);
    Object.values(InequalitiesSexTableHeadingsEnum).forEach((heading, index) =>
      expect(
        screen.getByTestId(`header-${heading}-${index}`)
      ).toBeInTheDocument()
    );
  });

  it('should display x if data point is not available', () => {
    const expectedNumberOfRows = 2;
    render(<InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[0]} />);
    expect(screen.getAllByRole('cell')).toHaveLength(
      expectedNumberOfRows * CELLS_PER_ROW
    );
    screen
      .getAllByTestId('not-available')
      .forEach((id) => expect(id).toHaveTextContent('X'));
  });

  it('snapshot test - should match snapshot', () => {
    const container = render(
      <InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[1]} />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
