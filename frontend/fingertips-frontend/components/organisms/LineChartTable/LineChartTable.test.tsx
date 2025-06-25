import { render, screen, within } from '@testing-library/react';

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
import { IndicatorDocument } from '@/lib/search/searchTypes';

describe('Line chart table suite', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-25T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

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
          title={'Title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
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
          title={'Title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );
      const lineChart = screen.getByTestId('lineChartTable-component');
      expect(lineChart).toBeInTheDocument();
    });

    it('should render expected elements', () => {
      render(
        <LineChartTable
          title={'A line chart table title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(6);
      expect(
        within(rows[0]).getByText('No recent trend data available')
      ).toBeInTheDocument();

      expect(
        within(rows[1]).getByText(mockHealthData[0].areaName)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/95\s*%\s*confidence\s*limits/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/England/i)).toBeInTheDocument();

      expect(screen.getAllByRole('cell')).toHaveLength(15);

      Object.values(LineChartTableHeadingEnum)
        .filter((h) => h !== LineChartTableHeadingEnum.BenchmarkValue)
        .forEach((heading) =>
          expect(screen.getByTestId(`header-${heading}-0`)).toBeInTheDocument()
        );

      expect(screen.getByText(/A line chart table title/)).toBeInTheDocument();
    });

    it('should render the expected elements when England is the only area and 99.8%', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
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

    it('should render the group column with benchmark column styling, when the subnational benchmark is not england ', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          groupIndicatorData={MOCK_PARENT_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkToUse={MOCK_HEALTH_DATA[0].areaCode}
        />
      );

      expect(screen.getByTestId('group-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should render the group column with default group column styling, when the subnational benchmark is england ', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          groupIndicatorData={MOCK_PARENT_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkToUse={MOCK_ENGLAND_DATA.areaCode}
        />
      );

      expect(screen.getByTestId('group-header')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );
    });

    it('should display table with periods sorted in ascending order', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );

      expectPeriodsToBeDisplayedInAscendingOrder(CELLS_PER_ROW);
    });

    it('should render X if England benchmark prop is undefined', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[mockHealthData[0]]}
          englandIndicatorData={undefined}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
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
          title={'Title'}
          healthIndicatorData={[MOCK_HEALTH_DATA_WITH_TRENDS[0]]}
          englandIndicatorData={undefined}
          indicatorMetadata={{ unitLabel: 'per 100,000' } as IndicatorDocument}
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
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
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
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      const rows = screen.getAllByRole('row');
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(
        within(rows[0]).getAllByText('No recent trend data available')
      ).toHaveLength(2);
      expect(
        within(rows[1]).getByText(mockHealthData[0].areaName)
      ).toBeInTheDocument();

      expect(
        within(rows[1]).getByText(mockHealthData[1].areaName)
      ).toBeInTheDocument();

      expect(screen.getAllByText(/95%\s*confidence\s*limits/i)).toHaveLength(2);
      expect(screen.getByText(/England/i)).toBeInTheDocument();

      expect(screen.getAllByRole('cell')).toHaveLength(25);
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
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.AreaPeriod}-0`
        )
      ).toHaveLength(1);
      expect(screen.getAllByTestId(`england-subheader`)).toHaveLength(1);
    });

    it('should display table with periods sorted in ascending order', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );

      expectPeriodsToBeDisplayedInAscendingOrder(CELLS_PER_ROW);
    });

    it('should render trend markers for 2 indicators based on data returned by the API', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={MOCK_HEALTH_DATA_WITH_TRENDS}
          englandIndicatorData={undefined}
          indicatorMetadata={{ unitLabel: 'per 100,000' } as IndicatorDocument}
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
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          groupIndicatorData={MOCK_PARENT_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkToUse={MOCK_ENGLAND_DATA.areaCode}
        />
      );

      expect(screen.getAllByRole('columnheader')[6]).toHaveTextContent(
        MOCK_PARENT_DATA.areaName
      );

      expect(
        screen.queryByText(`Group: ${MOCK_PARENT_DATA.areaName}`)
      ).toBeInTheDocument();
    });

    it('should not render the parent area heading when not passed parentData', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );
      expect(screen.getAllByRole('columnheader')[6]).toHaveTextContent(
        MOCK_ENGLAND_DATA.areaName
      );
    });

    it('should render the parent expect number of cells elements', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={mockHealthData}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          groupIndicatorData={MOCK_PARENT_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );
      expect(screen.getAllByRole('cell')).toHaveLength(
        mockHealthData[0].healthData.length * 13
      );
    });

    it('should not render the group column when the area selected is England', () => {
      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[MOCK_ENGLAND_DATA]}
          groupIndicatorData={MOCK_PARENT_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
        />
      );

      expect(
        screen.queryByText(`Group: ${MOCK_PARENT_DATA.areaName}`)
      ).not.toBeInTheDocument();
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

  describe('LineChartTable when mismatched years are supplied', () => {
    it('should not render Xs but keep the correct years aligned', () => {
      const mockHealthArea1 = JSON.parse(JSON.stringify(MOCK_ENGLAND_DATA));
      mockHealthArea1.areaName = 'year-2005-in-between-england-values';
      mockHealthArea1.areaCode = '2005';
      mockHealthArea1.healthData[1] = {
        ...mockHealthArea1.healthData[1],
        year: 2005,
      };

      const mockHealthArea2 = JSON.parse(JSON.stringify(MOCK_ENGLAND_DATA));
      mockHealthArea2.areaName = 'year-1999-not-in-england';
      mockHealthArea2.areaCode = '1999';
      mockHealthArea2.healthData[0] = {
        ...mockHealthArea2.healthData[0],
        year: 1999,
      };

      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={[mockHealthArea1, mockHealthArea2]}
          englandIndicatorData={MOCK_ENGLAND_DATA}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(8);
      // england and area 1 ara missing
      expect(rows[4]).toHaveTextContent(
        /^1999Not compared200904.90.00.0Not comparedXXXXX$/
      );
      // area 2 is missing
      expect(rows[5]).toHaveTextContent(
        /^2004Not comparedXXXXNot compared200904.90.00.0904.9$/
      );
      // england and area 2 are missing
      expect(rows[6]).toHaveTextContent(
        /^2005Not comparedXXXXNot compared500966.00.00.0X$/
      );

      // area 1 is missing
      expect(rows[7]).toHaveTextContent(
        /^2008Not compared500966.00.00.0Not comparedXXXX966.0$/
      );
    });

    it('should not render rows for benchmark or group years before or after the areas have data', () => {
      const mockBenchmarkAreaWithEarlyYear = JSON.parse(
        JSON.stringify(MOCK_ENGLAND_DATA)
      );
      mockBenchmarkAreaWithEarlyYear.healthData[1] = {
        ...mockBenchmarkAreaWithEarlyYear.healthData[1],
        year: 1999,
      };

      const mockGroupAreaWithLateYear = JSON.parse(
        JSON.stringify(MOCK_PARENT_DATA)
      );
      mockGroupAreaWithLateYear.healthData[1] = {
        ...mockBenchmarkAreaWithEarlyYear.healthData[1],
        year: 2036,
      };

      render(
        <LineChartTable
          title={'Title'}
          healthIndicatorData={MOCK_HEALTH_DATA}
          englandIndicatorData={mockBenchmarkAreaWithEarlyYear}
          groupIndicatorData={mockGroupAreaWithLateYear}
          indicatorMetadata={{ unitLabel: '%' } as IndicatorDocument}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      expect(screen.queryByText(/1999/)).not.toBeInTheDocument();
      expect(screen.queryByText(/2036/)).not.toBeInTheDocument();
    });
  });
});
