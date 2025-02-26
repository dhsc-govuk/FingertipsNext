import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  InequalitiesTable,
  InequalitiesTableRowData,
  mapToInequalitiesTableData,
} from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

describe('Inequalities table suite', () => {
  const CELLS_PER_ROW = 4;
  it('should render the InequalitiesSexTable component', () => {
    render(<InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(
      screen.getByTestId('inequalitiesSexTable-component')
    ).toBeInTheDocument();
  });

  it('should render expected elements', () => {
    const headings = ['Period', 'Persons', 'Male', 'Female'];

    render(<InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
      MOCK_HEALTH_DATA[1].areaName
    );
    expect(screen.getAllByRole('cell')).toHaveLength(CELLS_PER_ROW);
    headings.forEach((heading, index) =>
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

  describe('mapToInequalitiesTableData', () => {
    it('should map to inequalitiesSexTable row data', () => {
      const groupedYearData = {
        2004: {
          Male: [MOCK_HEALTH_DATA[0].healthData[1]],
          Female: [MOCK_HEALTH_DATA[0].healthData[2]],
        },
        2008: {
          All: [MOCK_HEALTH_DATA[1].healthData[0]],
          Male: [MOCK_HEALTH_DATA[1].healthData[1]],
          Female: [MOCK_HEALTH_DATA[1].healthData[2]],
        },
      };

      const expectedInequalitiesSexTableRow: InequalitiesTableRowData[] = [
        {
          period: 2004,
          Male: 703.420759,
          Female: 703.420759,
        },
        {
          period: 2008,
          Persons: 135.149304,
          Male: 890.328253,
          Female: 890.328253,
        },
      ];

      expect(mapToInequalitiesTableData(groupedYearData)).toEqual(
        expectedInequalitiesSexTableRow
      );
    });
  });

  it('snapshot test - should match snapshot', () => {
    const container = render(
      <InequalitiesTable healthIndicatorData={MOCK_HEALTH_DATA[1]} />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
