import { render, screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  LineChartTable,
  LineChartTableHeadingEnum,
  LineChartTableRowData,
  mapToLineChartTableData,
} from '@/components/organisms/LineChartTable/index';
import {
  MOCK_ENGLAND_DATA,
  MOCK_HEALTH_DATA,
  MOCK_HEALTH_DATA_WITH_TRENDS,
  MOCK_PARENT_DATA,
} from '@/lib/tableHelpers/mocks';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

describe('Line chart table suite', () => {
  const mockHealthData: HealthDataForArea[] = [
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 2008,
          count: 222,
          value: 890.305692,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
          benchmarkComparison: {
            benchmarkValue: 965.9843,
          },
        },
        {
          year: 2004,
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
          benchmarkComparison: {
            benchmarkValue: 904.874,
          },
        },
      ],
    },
    {
      ...MOCK_HEALTH_DATA[1],
      healthData: [
        ...MOCK_HEALTH_DATA[1].healthData.slice(0, -1),
        {
          year: 2004,
          count: 222,
          value: 135.149304,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  describe('1 Indicator, 1 Area', () => {
    const CELLS_PER_ROW = 7;

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the LineChartTable component', () => {
      render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );
      const lineChart = screen.getByTestId('lineChartTable-component');
      expect(lineChart).toBeInTheDocument();
    });

    it('should render expected elements', () => {
      render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(6);
      expect(
        within(rows[0]).getByText('No trend data available')
      ).toBeInTheDocument();

      expect(
        within(rows[1]).getByText(mockHealthData[0].areaName)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/95\s*%\s*confidence\s*limits/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/England/i)).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(
        mockHealthData[0].healthData.length * CELLS_PER_ROW
      );
      Object.values(LineChartTableHeadingEnum)
        .filter((h) => h !== LineChartTableHeadingEnum.BenchmarkValue)
        .forEach((heading) =>
          expect(screen.getByTestId(`header-${heading}-0`)).toBeInTheDocument()
        );
    });

    it('should render the expected elements when England is the only area and 99.8%', () => {
      render(
        <LineChartTable
          healthIndicatorData={[]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
          }
        />
      );

      expect(screen.getAllByRole('columnheader')[3]).toHaveTextContent(
        'England'
      );
      expect(
        screen.getByText(/99.8%\s*confidence\s*limits/i)
      ).toBeInTheDocument();
    });

    it('should have grey cell color for benchmark column', () => {
      render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );

      screen.getAllByTestId('grey-table-cell').forEach((greyCell) => {
        expect(greyCell).toHaveStyle(
          `background-color: ${GovukColours.MidGrey}`
        );
      });
      expect(screen.getByTestId(`header-benchmark-value`)).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('england-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should display table with periods sorted in ascending order', () => {
      render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );

      expectPeriodsToBeDisplayedInAscendingOrder(CELLS_PER_ROW);
    });

    it('should render X if England benchmark prop is undefined', () => {
      render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={undefined}
          measurementUnit="%"
        />
      );

      for (
        let i = CELLS_PER_ROW - 1;
        i < mockHealthData[0].healthData.length;
        i += CELLS_PER_ROW - 1
      ) {
        expect(
          screen.getAllByRole('cell')[i * CELLS_PER_ROW]
        ).toHaveTextContent('X');
      }
    });

    it('should render trend markers based on data returned by the API', () => {
      render(
        <LineChartTable
          healthIndicatorData={[MOCK_HEALTH_DATA_WITH_TRENDS[0]]}
          englandBenchmarkData={undefined}
          measurementUnit="per 100,000"
        />
      );

      // Right-facing arrow for the 'no significant change' trend
      expect(screen.getByTestId('arrow-right')).toBeVisible();
      expect(screen.getByText('No significant change')).toBeInTheDocument();
    });
  });

  describe('1 Indicator, 2 Areas', () => {
    const CELLS_PER_ROW = 12;

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render expected elements', () => {
      render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      const rows = screen.getAllByRole('row');
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(
        within(rows[0]).getAllByText('No trend data available')
      ).toHaveLength(2);
      expect(
        within(rows[1]).getByText(mockHealthData[0].areaName)
      ).toBeInTheDocument();

      expect(
        within(rows[1]).getByText(mockHealthData[1].areaName)
      ).toBeInTheDocument();

      expect(screen.getAllByText(/95%\s*confidence\s*limits/i)).toHaveLength(2);
      expect(screen.getByText(/England/i)).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(
        mockHealthData[0].healthData.length * CELLS_PER_ROW
      );
      Object.values(LineChartTableHeadingEnum)
        .filter((h) => h !== LineChartTableHeadingEnum.BenchmarkValue)
        .forEach((heading) =>
          expect(
            screen.getAllByTestId(`header-${heading}-0`)[0]
          ).toBeInTheDocument()
        );
    });

    it('should have single period and benchmark columns', () => {
      render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.AreaPeriod}-0`
        )
      ).toHaveLength(1);
      expect(screen.getAllByTestId(`header-benchmark-value`)).toHaveLength(1);
    });

    it('should display table with periods sorted in ascending order', () => {
      render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );

      expectPeriodsToBeDisplayedInAscendingOrder(CELLS_PER_ROW);
    });

    it('should render trend markers for 2 indicators based on data returned by the API', () => {
      render(
        <LineChartTable
          healthIndicatorData={MOCK_HEALTH_DATA_WITH_TRENDS}
          englandBenchmarkData={undefined}
          measurementUnit="per 100,000"
        />
      );

      // Should be one indicator with 'no significant change' and the other 'increasing and getting worse'
      expect(screen.getByTestId('arrow-right')).toBeVisible();
      expect(screen.getByTestId('arrow-up')).toBeVisible();
      expect(screen.getAllByTestId('arrow-right')).toHaveLength(1);
      expect(screen.getAllByTestId('arrow-up')).toHaveLength(1);

      expect(screen.getAllByRole('columnheader')[1]).toHaveTextContent(
        'Recent trend:No significant change'
      );
      expect(screen.getAllByRole('columnheader')[2]).toHaveTextContent(
        'Recent trend:Increasing and getting worse'
      );
    });
  });

  describe('group data', () => {
    it('should render the parent area heading when passed parentData', () => {
      render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          groupIndicatorData={MOCK_PARENT_DATA}
          measurementUnit="%"
        />
      );

      expect(screen.getAllByRole('columnheader')[8]).toHaveTextContent(
        MOCK_PARENT_DATA.areaName
      );
    });
    it('should not render the parent area heading when not passed parentData', () => {
      render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );
      expect(screen.getAllByRole('columnheader')[7]).toHaveTextContent(
        MOCK_ENGLAND_DATA.areaName
      );
    });

    it('should render the parent expect number of cells elements', () => {
      render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          groupIndicatorData={MOCK_PARENT_DATA}
          measurementUnit="%"
        />
      );
      expect(screen.getAllByRole('cell')).toHaveLength(
        mockHealthData[0].healthData.length * 13
      );
    });
  });

  describe('mapToLineChartTableData', () => {
    it('should map to linechart table row data', () => {
      const expectedRowData: LineChartTableRowData[] = [
        {
          period: 2008,
          value: 890.305692,
          count: 222,
          upper: 578.32766,
          lower: 441.69151,
        },
        {
          count: 267,
          lower: 441.69151,
          period: 2004,
          upper: 578.32766,
          value: 703.420759,
        },
        {
          period: 2004,
          count: 267,
          value: 703.420759,
          lower: 441.69151,
          upper: 578.32766,
        },
        {
          period: 2004,
          count: 267,
          value: 703.420759,
          lower: 441.69151,
          upper: 578.32766,
        },
      ];

      expect(mapToLineChartTableData(MOCK_HEALTH_DATA[0])).toEqual(
        expectedRowData
      );
    });
  });

  const expectPeriodsToBeDisplayedInAscendingOrder = (cellsPerRow: number) => {
    const sortedHealthData = {
      ...mockHealthData[0],
      healthData: mockHealthData[0].healthData.toSorted(
        (a, b) => a.year - b.year
      ),
    };

    for (let i = 0; i < mockHealthData[0].healthData.length; i++) {
      expect(screen.getAllByRole('cell')[i * cellsPerRow]).toHaveTextContent(
        String(sortedHealthData.healthData[i].year)
      );
    }
  };

  describe('LineChartTable when given quintiles data', () => {
    it('should not render the benchmark column', () => {
      render(
        <LineChartTable
          healthIndicatorData={[mockHealthData[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
          benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
        />
      );

      expect(
        screen.queryByTestId(`header-benchmark-value`)
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('england-header')).not.toBeInTheDocument();
    });
  });
});
