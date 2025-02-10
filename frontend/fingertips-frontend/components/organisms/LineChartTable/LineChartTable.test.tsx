import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { LineChartTable } from '@/components/organisms/LineChartTable/index';
import {
  LIGHT_GREY,
  LineChartTableHeadingEnum,
} from '@/lib/chartHelpers/chartHelpers';
import { MOCK_ENGLAND_DATA, MOCK_HEALTH_DATA } from './mocks';

describe('Line chart table suite', () => {
  describe('1 Indicator, 1 Area', () => {
    const CELLS_PER_ROW = 7;

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <LineChartTable
          data={[MOCK_HEALTH_DATA[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the LineChartTable component', () => {
      render(
        <LineChartTable
          data={[MOCK_HEALTH_DATA[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );
      const lineChart = screen.getByTestId('lineChartTable-component');
      expect(lineChart).toBeInTheDocument();
    });

    it('should render expected elements', () => {
      render(
        <LineChartTable
          data={[MOCK_HEALTH_DATA[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
        `${MOCK_HEALTH_DATA[0].areaName} recent trend:`
      );
      expect(screen.getAllByRole('columnheader')[2]).toHaveTextContent(
        MOCK_HEALTH_DATA[0].areaName
      );
      expect(screen.getByText(/95% confidence limits/i)).toBeInTheDocument();
      expect(screen.getByText(/England/i)).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(
        MOCK_HEALTH_DATA[0].healthData.length * CELLS_PER_ROW
      );
      Object.values(LineChartTableHeadingEnum).forEach((heading, index) =>
        expect(
          screen.getByTestId(`header-${heading}-${index}`)
        ).toBeInTheDocument()
      );
    });

    it('should have grey cell color for benchmark column', () => {
      const benchmarkValueIndex = Object.values(
        LineChartTableHeadingEnum
      ).findIndex(
        (value) => value === LineChartTableHeadingEnum.BenchmarkValue
      );

      render(
        <LineChartTable
          data={MOCK_HEALTH_DATA}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );

      screen.getAllByTestId('grey-table-cell').forEach((greyCell) => {
        expect(greyCell).toHaveStyle(`background-color: ${LIGHT_GREY}`);
      });
      expect(
        screen.getByTestId(
          `header-${LineChartTableHeadingEnum.BenchmarkValue}-${benchmarkValueIndex}`
        )
      ).toHaveStyle(`background-color: ${LIGHT_GREY}`);
      expect(screen.getByTestId('england-header')).toHaveStyle(
        `background-color: ${LIGHT_GREY}`
      );
    });

    it('should display table with periods sorted in ascending order', () => {
      render(
        <LineChartTable
          data={[MOCK_HEALTH_DATA[0]]}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );

      expectPeriodsToBeDisplayedInAscendingOrder(CELLS_PER_ROW);
    });

    it('should render dashes if England benchmark prop is undefined', () => {
      render(
        <LineChartTable
          data={MOCK_HEALTH_DATA}
          englandBenchmarkData={undefined}
        />
      );

      for (
        let i = CELLS_PER_ROW - 1;
        i < MOCK_HEALTH_DATA[0].healthData.length;
        i += CELLS_PER_ROW - 1
      ) {
        expect(
          screen.getAllByRole('cell')[i * CELLS_PER_ROW]
        ).toHaveTextContent('-');
      }
    });
  });

  describe('1 Indicator, 2 Areas', () => {
    const CELLS_PER_ROW = 12;

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <LineChartTable
          data={MOCK_HEALTH_DATA}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render expected elements', () => {
      render(
        <LineChartTable
          data={MOCK_HEALTH_DATA}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
        `${MOCK_HEALTH_DATA[0].areaName} recent trend:`
      );
      expect(screen.getAllByRole('columnheader')[1]).toHaveTextContent(
        `${MOCK_HEALTH_DATA[2].areaName} recent trend:`
      );
      expect(screen.getAllByRole('columnheader')[3]).toHaveTextContent(
        MOCK_HEALTH_DATA[0].areaName
      );
      expect(screen.getAllByRole('columnheader')[6]).toHaveTextContent(
        MOCK_HEALTH_DATA[2].areaName
      );
      expect(screen.getAllByText(/95% confidence limits/i)).toHaveLength(2);
      expect(screen.getByText(/England/i)).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(
        MOCK_HEALTH_DATA[0].healthData.length * CELLS_PER_ROW
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
          data={MOCK_HEALTH_DATA}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
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
          data={MOCK_HEALTH_DATA}
          englandBenchmarkData={MOCK_ENGLAND_DATA}
        />
      );

      expectPeriodsToBeDisplayedInAscendingOrder(CELLS_PER_ROW);
    });
  });

  const expectPeriodsToBeDisplayedInAscendingOrder = (cellsPerRow: number) => {
    const sortedHealthData = {
      ...MOCK_HEALTH_DATA[0],
      healthData: MOCK_HEALTH_DATA[0].healthData.toSorted(
        (a, b) => a.year - b.year
      ),
    };

    for (let i = 0; i < MOCK_HEALTH_DATA[0].healthData.length; i++) {
      expect(screen.getAllByRole('cell')[i * cellsPerRow]).toHaveTextContent(
        String(sortedHealthData.healthData[i].year)
      );
    }
  };
});
