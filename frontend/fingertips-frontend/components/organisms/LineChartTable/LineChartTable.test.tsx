import { render, screen } from '@testing-library/react';
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
  MOCK_PARENT_DATA,
} from '@/lib/tableHelpers/mocks';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';

describe('Line chart table suite', () => {
  const mockHealthData = [
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
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
        {
          year: 2004,
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    },
    {
      ...MOCK_HEALTH_DATA[1],
      healthData: [
        ...MOCK_HEALTH_DATA[1].healthData,
        {
          year: 2004,
          count: 222,
          value: 135.149304,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
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
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
        `${mockHealthData[0].areaName} recent trend:`
      );
      expect(screen.getAllByRole('columnheader')[2]).toHaveTextContent(
        mockHealthData[0].areaName
      );
      expect(screen.getByText(/95% confidence limits/i)).toBeInTheDocument();
      expect(screen.getByText(/England/i)).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(
        mockHealthData[0].healthData.length * CELLS_PER_ROW
      );
      Object.values(LineChartTableHeadingEnum).forEach((heading, index) =>
        expect(
          screen.getByTestId(`header-${heading}-${index}`)
        ).toBeInTheDocument()
      );
    });

    it('should render the expected elements when England is the only area', () => {
      render(
        <LineChartTable
          healthIndicatorData={[]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
        />
      );

      expect(screen.getAllByRole('columnheader')[2]).toHaveTextContent(
        'England'
      );
      expect(screen.getByText(/95% confidence limits/i)).toBeInTheDocument();
    });

    it('should have grey cell color for benchmark column', () => {
      const benchmarkValueIndex = Object.values(
        LineChartTableHeadingEnum
      ).findIndex(
        (value) => value === LineChartTableHeadingEnum.BenchmarkValue
      );

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
      expect(
        screen.getByTestId(
          `header-${LineChartTableHeadingEnum.BenchmarkValue}-${benchmarkValueIndex}`
        )
      ).toHaveStyle(`background-color: ${GovukColours.MidGrey}`);
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
  });

  describe('1 Indicator, 2 Areas', () => {
    const CELLS_PER_ROW = 12;

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <LineChartTable
          healthIndicatorData={mockHealthData}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
          measurementUnit="%"
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
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')[1]).toHaveTextContent(
        `${mockHealthData[0].areaName} recent trend:`
      );
      expect(screen.getAllByRole('columnheader')[2]).toHaveTextContent(
        `${mockHealthData[1].areaName} recent trend:`
      );
      expect(screen.getAllByRole('columnheader')[4]).toHaveTextContent(
        mockHealthData[0].areaName
      );
      expect(screen.getAllByRole('columnheader')[5]).toHaveTextContent(
        mockHealthData[1].areaName
      );
      expect(screen.getAllByText(/95% confidence limits/i)).toHaveLength(2);
      expect(screen.getByText(/England/i)).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(
        mockHealthData[0].healthData.length * CELLS_PER_ROW
      );
      Object.values(LineChartTableHeadingEnum).forEach((heading, index) =>
        expect(
          screen.getAllByTestId(`header-${heading}-${index}`)[0]
        ).toBeInTheDocument()
      );
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.BenchmarkTrend}-1`
        )[1]
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.AreaCount}-2`
        )[1]
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.AreaValue}-3`
        )[1]
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.AreaLower}-4`
        )[1]
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.AreaUpper}-5`
        )[1]
      ).toBeInTheDocument();
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
      expect(
        screen.getAllByTestId(
          `header-${LineChartTableHeadingEnum.BenchmarkValue}-6`
        )
      ).toHaveLength(1);
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
      expect(screen.getAllByRole('columnheader')[6]).toHaveTextContent(
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
      expect(screen.getAllByRole('columnheader')[6]).toHaveTextContent(
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
});
