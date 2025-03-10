import { InequalitiesBarChartTable, InequalitiesBarChartTableHeaders } from '.';
import { GROUPED_YEAR_DATA, MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  Inequalities,
  InequalitiesBarChartTableData,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';

describe('Inequalities bar chart table suite', () => {
  describe('Sex inequality', () => {
    const tableData: InequalitiesBarChartTableData = {
      areaName: MOCK_HEALTH_DATA[1].areaName,
      data: {
        period: 2008,
        inequalities: {
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
      },
    };

    it('should render the inequalitiesBarChartTable component', () => {
      render(
        <InequalitiesBarChartTable
          tableData={tableData}
          yearlyHealthDataGroupedByInequalities={GROUPED_YEAR_DATA}
          type={Inequalities.Sex}
        />
      );

      expect(
        screen.getByTestId('inequalitiesBarChartTable-component')
      ).toBeInTheDocument();
    });

    it('should render expected elements', () => {
      const expectedGroupings = ['Persons', 'Male', 'Female'];

      render(
        <InequalitiesBarChartTable
          tableData={tableData}
          yearlyHealthDataGroupedByInequalities={GROUPED_YEAR_DATA}
          type={Inequalities.Sex}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      Object.values(InequalitiesBarChartTableHeaders).forEach((header) => {
        expect(screen.getByTestId(`heading-${header}`)).toBeInTheDocument();
      });
      expectedGroupings.forEach((grouping) => {
        expect(screen.getByText(grouping)).toBeInTheDocument();
      });
    });

    it('should display x if data point is not available', () => {
      const expectedNumberOfRows = 3;
      const mockData: InequalitiesBarChartTableData = {
        areaName: tableData.areaName,
        data: {
          period: 2004,
          inequalities: {
            Persons: { value: 890.3432 },
            Male: { value: 703.420759 },
            Female: { value: 703.420759 },
          },
        },
      };

      render(
        <InequalitiesBarChartTable
          tableData={mockData}
          yearlyHealthDataGroupedByInequalities={GROUPED_YEAR_DATA}
          type={Inequalities.Sex}
        />
      );
      expect(screen.getAllByRole('cell')).toHaveLength(
        expectedNumberOfRows *
          Object.values(InequalitiesBarChartTableHeaders).length
      );
      screen
        .getAllByTestId('not-available')
        .forEach((id) => expect(id).toHaveTextContent('X'));
    });

    it('check if the measurementUnit value "kg" is rendered correctly with braces', () => {
      render(
        <InequalitiesBarChartTable
          tableData={tableData}
          yearlyHealthDataGroupedByInequalities={GROUPED_YEAR_DATA}
          type={Inequalities.Sex}
          measurementUnit="kg"
        />
      );
      expect(screen.getByText('(kg)')).toBeInTheDocument();
    });

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <InequalitiesBarChartTable
          tableData={tableData}
          yearlyHealthDataGroupedByInequalities={GROUPED_YEAR_DATA}
          type={Inequalities.Sex}
        />
      );

      expect(container.asFragment()).toMatchSnapshot();
    });
  });
});
