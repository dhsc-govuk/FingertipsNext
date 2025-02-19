import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesSexTable } from '.';
import { MOCK_ENGLAND_DATA, MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { InequalitiesSexTableHeadingsEnum } from '@/lib/tableHelpers';

describe('Inequalities sex table suite', () => {
  const CELLS_PER_ROW = 5;
  it('should render the InequalitiesSexTable component', () => {
    render(
      <InequalitiesSexTable
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        englandBenchmarkData={MOCK_ENGLAND_DATA}
      />
    );

    expect(
      screen.getByTestId('inequalitiesSexTable-component')
    ).toBeInTheDocument();
  });

  it('should render expected elements', () => {
    render(
      <InequalitiesSexTable
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        englandBenchmarkData={MOCK_ENGLAND_DATA}
      />
    );

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
    render(
      <InequalitiesSexTable
        healthIndicatorData={MOCK_HEALTH_DATA[0]}
        englandBenchmarkData={MOCK_ENGLAND_DATA}
      />
    );
    expect(screen.getAllByRole('cell')).toHaveLength(
      expectedNumberOfRows * CELLS_PER_ROW
    );
    screen
      .getAllByRole('paragraph')
      .forEach((paragraph) => expect(paragraph).toHaveTextContent('x'));
  });

  it('snapshot test - should match snapshot', () => {
    const container = render(
      <InequalitiesSexTable
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        englandBenchmarkData={MOCK_ENGLAND_DATA}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
