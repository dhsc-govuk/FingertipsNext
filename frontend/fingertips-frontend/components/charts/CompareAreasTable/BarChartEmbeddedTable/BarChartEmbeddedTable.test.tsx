import { act, render, screen, within } from '@testing-library/react';
import { BarChartEmbeddedTable } from '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable';
import {
  DatePeriod,
  Frequency,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import {
  allAgesAge,
  disaggregatedAge,
  noDeprivation,
  personsSex,
} from '@/lib/mocks';
import { formatNumber } from '@/lib/numberFormatter';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

function cloneDeep<T>(input: T) {
  return JSON.parse(JSON.stringify(input)) as T;
}

describe('BarChartEmbeddedTable', () => {
  const mockHealthIndicatorData: HealthDataForArea[] = [
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 0,
          datePeriod: {
            type: PeriodType.Financial,
            from: new Date('2008-01-01'),
            to: new Date('2008-12-31'),
          },
          count: 222,
          value: 890.305692,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          deprivation: noDeprivation,
          benchmarkComparison: { benchmarkAreaName: 'England' },
        },
        {
          year: 0,
          datePeriod: {
            type: PeriodType.Financial,
            from: new Date('2004-01-01'),
            to: new Date('2004-12-31'),
          },
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated, // Only the latest data point will have a trend calculated
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'E40000014',
      areaName: 'NHS North West Region',
      healthData: [
        {
          year: 0,
          datePeriod: {
            type: PeriodType.Financial,
            from: new Date('2008-01-01'),
            to: new Date('2008-12-31'),
          },
          count: 777,
          value: 1000,
          lowerCi: 500,
          upperCi: 1500,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          deprivation: noDeprivation,
          benchmarkComparison: { benchmarkAreaName: 'England' },
        },
        {
          year: 0,
          datePeriod: {
            type: PeriodType.Financial,
            from: new Date('2004-01-01'),
            to: new Date('2004-12-31'),
          },
          count: 777,
          value: 1000,
          lowerCi: 500,
          upperCi: 1500,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'A1426',
      areaName: 'Area 2',
      healthData: [
        {
          year: 0,
          datePeriod: {
            type: PeriodType.Financial,
            from: new Date('2004-01-01'),
            to: new Date('2004-12-31'),
          },
          count: 157,
          value: 723.090354,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: {
            type: PeriodType.Financial,
            from: new Date('2008-01-01'),
            to: new Date('2008-12-31'),
          },
          count: 256,
          value: 905.145997,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.DecreasingAndGettingBetter,
          deprivation: noDeprivation,
          benchmarkComparison: { benchmarkAreaName: 'England' },
        },
      ],
    },
  ];

  const mockDatePeriod: DatePeriod = {
    type: PeriodType.Financial,
    from: new Date('2008-01-01'),
    to: new Date('2008-12-31'),
  };

  function getPointForYear(
    healthData: HealthDataForArea,
    datePeriod: DatePeriod
  ): HealthDataPoint | undefined {
    return healthData.healthData.find(
      (hdp) =>
        convertDateToNumber(hdp.datePeriod?.to) ===
        convertDateToNumber(datePeriod?.to)
    );
  }

  const mockBenchmarkData: HealthDataForArea = {
    areaCode: 'E92000001',
    areaName: 'England',
    healthData: [
      {
        year: 0,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2004-01-01'),
          to: new Date('2004-12-31'),
        },
        count: 200,
        value: 904.874,
        lowerCi: undefined,
        upperCi: undefined,
        ageBand: disaggregatedAge('0-4'),
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
      {
        year: 0,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2008-01-01'),
          to: new Date('2008-12-31'),
        },
        count: 500,
        value: 965.9843,
        lowerCi: undefined,
        upperCi: undefined,
        ageBand: disaggregatedAge('10-14'),
        sex: personsSex,
        trend: HealthDataPointTrendEnum.DecreasingAndGettingBetter,
        deprivation: noDeprivation,
      },
    ],
  };

  const mockGroupData: HealthDataForArea = {
    areaCode: 'E40000014',
    areaName: 'NHS North West Region',
    healthData: [
      {
        year: 0,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2008-01-01'),
          to: new Date('2008-12-31'),
        },
        count: 777,
        value: 1000,
        lowerCi: 500,
        upperCi: 1500,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NoSignificantChange,
        deprivation: noDeprivation,
      },
      {
        year: 0,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2004-01-01'),
          to: new Date('2004-12-31'),
        },
        count: 777,
        value: 1000,
        lowerCi: 500,
        upperCi: 1500,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ],
  };

  it('should render BarChartEmbeddedTable component with title', async () => {
    render(
      <BarChartEmbeddedTable
        benchmarkToUse={areaCodeForEngland}
        healthIndicatorData={mockHealthIndicatorData}
        indicatorMetadata={
          { indicatorName: 'Falls in over 65s' } as IndicatorDocument
        }
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    expect(await screen.findByRole('table')).toBeInTheDocument();
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent(
      'Falls in over 65s, Financial year 2008/09'
    );
    expect(headings[1]).toHaveTextContent('Compared to England');
    expect(
      await screen.findByTestId('barChartEmbeddedTable-component')
    ).toBeInTheDocument();
  });

  it('should always display benchmark data in the first table row of data', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    const row = await screen.findAllByRole('row');

    expect(row[2]).toHaveTextContent('England');
    expect(screen.getByTestId('table-row-benchmark')).toBeInTheDocument();
  });

  it('should display group data in the second row of table data, when the group selected is not England', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        groupIndicatorData={mockGroupData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    const row = await screen.findAllByRole('row');

    expect(row[3]).toHaveTextContent('NHS North West Region');
    expect(await screen.findByTestId('table-row-group')).toBeInTheDocument();
  });

  it('should not display group row or benchmark row in the table, when no data is passed', async () => {
    await act(async () => {
      render(
        <BarChartEmbeddedTable
          healthIndicatorData={mockHealthIndicatorData}
          benchmarkToUse={areaCodeForEngland}
          englandData={undefined}
          groupIndicatorData={undefined}
          periodType={PeriodType.Financial}
          frequency={Frequency.Annually}
          latestDataPeriod={mockDatePeriod}
          isSmallestReportingPeriod={true}
        />
      );
    });

    expect(screen.queryByTestId('table-row-group')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-row-benchmark')).not.toBeInTheDocument();
  });

  it('should display data table row colours for benchmark and group', async () => {
    await act(async () => {
      render(
        <BarChartEmbeddedTable
          healthIndicatorData={mockHealthIndicatorData}
          benchmarkToUse={areaCodeForEngland}
          englandData={mockBenchmarkData}
          periodType={PeriodType.Financial}
          frequency={Frequency.Annually}
          latestDataPeriod={mockDatePeriod}
          isSmallestReportingPeriod={true}
        />
      );
    });
    // benchmark row
    expect(screen.getAllByRole('row')[1]).toHaveStyle(
      'backgroundColor: GovukColours.MidGrey'
    );
    // group row
    expect(screen.getAllByRole('row')[2]).toHaveStyle(
      'backgroundColor: GovukColours.LightGrey'
    );
  });

  it('should order the data displayed by largest value', async () => {
    const expectedValues = mockHealthIndicatorData
      .map((mdp) => getPointForYear(mdp, mockDatePeriod)?.value)
      .sort((a, b) => b! - a!)
      .map((ev) => formatNumber(ev));

    await act(() =>
      render(
        <BarChartEmbeddedTable
          benchmarkToUse={areaCodeForEngland}
          healthIndicatorData={mockHealthIndicatorData}
          periodType={PeriodType.Financial}
          frequency={Frequency.Annually}
          latestDataPeriod={mockDatePeriod}
          isSmallestReportingPeriod={true}
        />
      )
    );

    const header = screen.getAllByRole('columnheader');
    const valueColumnIndex =
      header.findIndex((item) => item.textContent?.includes('Value')) - 2;

    const areaRows = screen.getAllByRole('row').slice(2);

    const valueCells = areaRows.map((areaRow) => {
      const cellsInRow = within(areaRow).getAllByRole('cell');
      return cellsInRow[valueColumnIndex].textContent;
    });

    expect(valueCells).toEqual(expectedValues);
  });

  it('should order the data displayed by the area name if values match', async () => {
    const mockData = cloneDeep(mockHealthIndicatorData);
    mockData.forEach((row) => {
      row.healthData.forEach((hdp) => (hdp.value = 186.734));
    });

    const expectedValues = mockData
      .map((mdp) => mdp.areaName)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    await act(() =>
      render(
        <BarChartEmbeddedTable
          benchmarkToUse={areaCodeForEngland}
          healthIndicatorData={mockData}
          periodType={PeriodType.Financial}
          frequency={Frequency.Annually}
          latestDataPeriod={mockDatePeriod}
          isSmallestReportingPeriod={true}
        />
      )
    );

    const header = screen.getAllByRole('columnheader');
    const valueColumnIndex =
      header.findIndex((item) => item.textContent?.includes('Area')) - 2;

    const areaRows = screen.getAllByRole('row').slice(2);

    const valueCells = areaRows.map((areaRow) => {
      const cellsInRow = within(areaRow).getAllByRole('cell');
      return cellsInRow[valueColumnIndex].textContent;
    });

    expect(valueCells).toEqual(expectedValues);
  });

  it('should display an X in the table cell if there is no value', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    const noValueCells = await screen.findAllByText('X');
    expect(noValueCells).toHaveLength(2);
  });

  it('should display an empty area row with x-s and no spark line chart', async () => {
    const emptyRowData = [
      {
        areaCode: mockHealthIndicatorData[0].areaCode,
        areaName: mockHealthIndicatorData[0].areaName,
        healthData: [],
      },
    ];

    render(
      <BarChartEmbeddedTable
        healthIndicatorData={emptyRowData}
        benchmarkToUse={areaCodeForEngland}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    const noValueCells = await screen.findAllByText('X');
    expect(noValueCells).toHaveLength(4);

    const sparkline = screen.queryAllByTestId(
      'highcharts-react-component-barChartEmbeddedTable'
    );
    expect(sparkline).toHaveLength(0);
  });

  it('should display correct aria label when then is no value', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    const noValueCells = await screen.findAllByLabelText('Not compared');
    expect(noValueCells).toHaveLength(2);
  });

  it('should render the SparklineChart bars for each area displayed in the table and benchmark legend', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    const sparkline = await screen.findAllByTestId(
      'highcharts-react-component-barChartEmbeddedTable'
    );

    expect(sparkline).toHaveLength(4);
    expect(screen.getByTestId('benchmarkLegend-component')).toBeInTheDocument();
  });

  it('should render the checkbox', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );
    const checkbox = await screen.findByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  // DHSCFT-372 - Add trends to the compare areas bar charts
  it('should render the correct trend for all data provided', async () => {
    await act(() =>
      render(
        <BarChartEmbeddedTable
          healthIndicatorData={mockHealthIndicatorData}
          benchmarkToUse={areaCodeForEngland}
          englandData={mockBenchmarkData}
          periodType={PeriodType.Financial}
          frequency={Frequency.Annually}
          latestDataPeriod={mockDatePeriod}
          isSmallestReportingPeriod={true}
        />
      )
    );

    const trendTags = screen.getAllByTestId('trend-tag-component');

    expect(trendTags).toHaveLength(4);
    expect(trendTags[0].textContent).toEqual('Decreasing and getting better'); // England benchmark trend
    expect(trendTags[1].textContent).toEqual('No recent trend data available'); // E40000014 trend
    expect(trendTags[2].textContent).toEqual('Decreasing and getting better'); // A1426 trend
    expect(trendTags[3].textContent).toEqual('No recent trend data available'); // A1425 trend
  });

  it('should render the data source if provided', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        indicatorMetadata={
          {
            indicatorID: '1',
            indicatorName: 'Indicator',
            dataSource: 'bar chart data source',
          } as IndicatorDocument
        }
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    expect(
      await screen.findByText('Data source: bar chart data source')
    ).toBeInTheDocument();
  });

  it('should render the export button', async () => {
    render(
      <BarChartEmbeddedTable
        healthIndicatorData={mockHealthIndicatorData}
        benchmarkToUse={areaCodeForEngland}
        englandData={mockBenchmarkData}
        periodType={PeriodType.Financial}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    );

    expect(
      await screen.findByRole('button', { name: `Export options` })
    ).toBeInTheDocument();
  });
});
