import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesLineChartTable } from '.';
import { GROUPED_YEAR_DATA, MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import {
  Inequalities,
  InequalitiesChartData,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';

describe('Inequalities table suite', () => {
  describe('Sex inequality', () => {
    const CELLS_PER_ROW = 4;

    const tableData: InequalitiesChartData = {
      areaName: MOCK_HEALTH_DATA[1].areaName,
      rowData: [
        {
          period: 2004,
          inequalities: {
            Persons: { value: 890.3432 },
            Male: { value: 703.420759 },
            Female: { value: 703.420759 },
          },
        },
        {
          period: 2008,
          inequalities: {
            Persons: { value: 135.149304 },
            Male: { value: 890.328253 },
            Female: { value: 890.328253 },
          },
        },
      ],
    };

    it('should render the InequalitiesTable component', () => {
      render(
        <InequalitiesLineChartTable
          tableData={tableData}
          dynamicKeys={['Persons', 'Male', 'Female']}
        />
      );

      expect(
        screen.getByTestId('inequalitiesLineChartTable-component')
      ).toBeInTheDocument();
    });

    it('should render expected elements', () => {
      const headings = ['Period', 'Persons', 'Male', 'Female'];

      render(
        <InequalitiesLineChartTable
          tableData={tableData}
          dynamicKeys={['Persons', 'Male', 'Female']}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
        MOCK_HEALTH_DATA[1].areaName
      );
      expect(screen.getAllByRole('cell')).toHaveLength(
        tableData.rowData.length * CELLS_PER_ROW
      );
      headings.forEach((heading, index) =>
        expect(
          screen.getByTestId(`header-${heading}-${index}`)
        ).toBeInTheDocument()
      );
    });

    it('should display x if data point is not available', () => {
      const expectedNumberOfRows = 2;
      const tableData: InequalitiesChartData = {
        areaName: MOCK_HEALTH_DATA[1].areaName,
        rowData: [
          {
            period: 2004,
            inequalities: {
              Persons: { value: 890.3432 },
              Male: { value: 703.420759 },
              Female: { value: 703.420759 },
            },
          },
          {
            period: 2008,
            inequalities: { Persons: { value: 135.149304 } },
          },
        ],
      };

      render(
        <InequalitiesLineChartTable
          tableData={tableData}
          dynamicKeys={['Persons', 'Male', 'Female']}
        />
      );
      expect(screen.getAllByRole('cell')).toHaveLength(
        expectedNumberOfRows * CELLS_PER_ROW
      );
      screen
        .getAllByTestId('not-available')
        .forEach((id) => expect(id).toHaveTextContent('X'));
    });

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <InequalitiesLineChartTable
          tableData={tableData}
          dynamicKeys={['Persons', 'Male', 'Female']}
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });
  });
});
