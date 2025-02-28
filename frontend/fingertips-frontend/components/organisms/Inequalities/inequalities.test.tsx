import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  Inequalities,
  InequalitiesTableRowData,
  mapToInequalitiesTableData,
} from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

describe('Inequalities suite', () => {
  it('should render inequalities component', () => {
    render(<Inequalities healthIndicatorData={MOCK_HEALTH_DATA[1]} />);

    expect(screen.getByTestId('inequalities-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesTable-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesBarChartTable-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesLineChartAndTable')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesBarChartAndTable')
    ).toBeInTheDocument();
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
          Male: {
            value: 703.420759,
            count: 267,
            upper: 578.32766,
            lower: 441.69151,
          },
          Female: {
            value: 703.420759,
            count: 267,
            upper: 578.32766,
            lower: 441.69151,
          },
        },
        {
          period: 2008,
          Persons: {
            value: 135.149304,
            count: 222,
            upper: 578.32766,
            lower: 441.69151,
          },
          Male: {
            value: 890.328253,
            count: 131,
            upper: 578.32766,
            lower: 441.69151,
          },
          Female: {
            value: 890.328253,
            count: 131,
            upper: 578.32766,
            lower: 441.69151,
          },
        },
      ];

      expect(mapToInequalitiesTableData(groupedYearData)).toEqual(
        expectedInequalitiesSexTableRow
      );
    });
  });
});
