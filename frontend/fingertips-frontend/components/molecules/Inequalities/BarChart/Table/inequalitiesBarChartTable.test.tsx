import { InequalitiesBarChartTable, InequalitiesBarChartTableHeaders } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesBarChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { tableData } from '../mocks';

describe('Inequalities bar chart table suite', () => {
  describe('Sex inequality', () => {
    it('should render the inequalitiesBarChartTable component', () => {
      render(
        <InequalitiesBarChartTable
          tableData={tableData}
          dynamicKeys={['Persons', 'Male', 'Female']}
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
          dynamicKeys={['Persons', 'Male', 'Female']}
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
      const mockData: InequalitiesBarChartData = {
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
          dynamicKeys={['Persons', 'Male', 'Female']}
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

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <InequalitiesBarChartTable
          tableData={tableData}
          dynamicKeys={['Persons', 'Male', 'Female']}
        />
      );

      expect(container.asFragment()).toMatchSnapshot();
    });
  });
});
