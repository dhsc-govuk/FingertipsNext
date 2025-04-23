import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesLineChartTable } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { InequalitiesChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';

describe('Inequalities table suite', () => {
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
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute(
      'colspan',
      headings.length.toString()
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

  it('should render only period heading when empty dynamic keys are passed', () => {
    const absentHeadings = ['Persons', 'Male', 'Female'];
    const cellsPerRow = 1;

    render(
      <InequalitiesLineChartTable tableData={tableData} dynamicKeys={[]} />
    );

    expect(screen.getByTestId('header-Period-0')).toBeInTheDocument();
    absentHeadings.forEach((heading, index) =>
      expect(
        screen.queryByTestId(`header-${heading}-${index + 1}`)
      ).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole('cell')).toHaveLength(
      tableData.rowData.length * cellsPerRow
    );
  });

  it('When the UI is rendered with measurement unit it should render correctly', () => {
    render(
      <InequalitiesLineChartTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        measurementUnit="per 100,000"
      />
    );
    expect(screen.getByText('Value: per 100,000')).toBeInTheDocument();
  });

  it("Value: 'unit measurement' should not be in document when the unit measurement is not provided", () => {
    render(
      <InequalitiesLineChartTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
      />
    );

    expect(
      screen.queryByTestId('inequalitiesLineChartTable-measurementUnit')
    ).not.toBeInTheDocument();
  });

  it('snapshot test - should match snapshot', () => {
    const container = render(
      <InequalitiesLineChartTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        measurementUnit="per 100,000"
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should not render rows for aggregate (benchmark or group) years before or after the areas have data', () => {
    const tableDataWithExtraYears: InequalitiesChartData = {
      ...tableData,
      rowData: [
        ...tableData.rowData,
        {
          period: 1999,
          inequalities: {
            Persons: {
              isAggregate: true,
            },
          },
        },
        {
          period: 2036,
          inequalities: {
            Persons: {
              isAggregate: true,
            },
          },
        },
      ],
    };

    render(
      <InequalitiesLineChartTable
        tableData={tableDataWithExtraYears}
        dynamicKeys={['Persons', 'Male', 'Female']}
      />
    );

    expect(screen.queryByText(/1999/)).not.toBeInTheDocument();
    expect(screen.queryByText(/2036/)).not.toBeInTheDocument();
  });
});
