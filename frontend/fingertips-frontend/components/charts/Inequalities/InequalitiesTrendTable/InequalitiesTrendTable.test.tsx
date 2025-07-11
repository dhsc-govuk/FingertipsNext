import { render, screen } from '@testing-library/react';

import { InequalitiesTrendTable } from './InequalitiesTrendTable';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { InequalitiesChartData } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { IndicatorDocument } from '@/lib/search/searchTypes';

describe('Inequalities table suite', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-25T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const CELLS_PER_ROW = 4;

  const tableData: InequalitiesChartData = {
    areaCode: MOCK_HEALTH_DATA[1].areaCode,
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

  it('should render the InequalitiesBarChartTable component', () => {
    render(
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
      />
    );

    expect(
      screen.getByTestId('inequalitiesLineChartTable-component')
    ).toBeInTheDocument();
  });

  it('should render expected elements', () => {
    const headings = ['Period', 'Persons', 'Male', 'Female'];

    render(
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
      />
    );

    expect(
      screen.getByText(/Inequalities Line chart table title/)
    ).toBeInTheDocument();
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
    expect(screen.getByRole('button')).toHaveTextContent('Export options');
  });

  it('should display x if data point is not available', () => {
    const expectedNumberOfRows = 2;
    const tableData: InequalitiesChartData = {
      areaCode: MOCK_HEALTH_DATA[1].areaCode,
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
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
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
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={[]}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
      />
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
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        indicatorMetadata={{ unitLabel: 'per 100,000' } as IndicatorDocument}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
      />
    );
    expect(screen.getByText('Value: per 100,000')).toBeInTheDocument();
  });

  it("Value: 'unit measurement' should not be in document when the unit measurement is not provided", () => {
    render(
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
      />
    );

    expect(
      screen.queryByTestId('inequalitiesLineChartTable-measurementUnit')
    ).not.toBeInTheDocument();
  });

  it('snapshot test - should match snapshot', () => {
    const container = render(
      <InequalitiesTrendTable
        tableData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        indicatorMetadata={{ unitLabel: 'per 100,000' } as IndicatorDocument}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
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
          period: 2003,
          inequalities: {
            Persons: {
              isAggregate: true,
            },
          },
        },
        {
          period: 2009,
          inequalities: {
            Persons: {
              isAggregate: true,
            },
          },
        },
      ],
    };

    render(
      <InequalitiesTrendTable
        tableData={tableDataWithExtraYears}
        dynamicKeys={['Persons', 'Male', 'Female']}
        inequalityTypeSelected="Sex"
        title="Inequalities Line chart table title"
      />
    );

    expect(screen.queryByText(/2003/)).not.toBeInTheDocument();
    expect(screen.queryByText(/2009/)).not.toBeInTheDocument();
    expect(screen.queryByText(/2004/)).toBeInTheDocument();
    expect(screen.queryByText(/2008/)).toBeInTheDocument();
  });
});
