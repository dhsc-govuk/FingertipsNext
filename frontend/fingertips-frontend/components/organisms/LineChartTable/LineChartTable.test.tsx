import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { LineChartTable } from '@/components/organisms/LineChartTable/index';
import {
  LIGHT_GREY,
  LineChartTableHeadingEnum,
} from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';

describe('Line chart table suite', () => {
  const MOCK_HEALTH_DATA = mockHealthData['1'][0];
  const CELLS_PER_ROW = 7;

  it('snapshot test - should match snapshot', () => {
    const container = render(<LineChartTable data={MOCK_HEALTH_DATA} />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the LineChartTable component', () => {
    render(<LineChartTable data={MOCK_HEALTH_DATA} />);
    const lineChart = screen.getByTestId('lineChartTable-component');
    expect(lineChart).toBeInTheDocument();
  });

  it('should render expected elements', () => {
    render(<LineChartTable data={MOCK_HEALTH_DATA} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(
      MOCK_HEALTH_DATA.areaCode
    );
    expect(screen.getByText(/95% confidence limits/i)).toBeInTheDocument();
    expect(screen.getByText(/England/i)).toBeInTheDocument();
    expect(screen.getAllByRole('cell')).toHaveLength(
      MOCK_HEALTH_DATA.healthData.length * CELLS_PER_ROW
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
    ).findIndex((value) => value === LineChartTableHeadingEnum.BenchmarkValue);

    render(<LineChartTable data={MOCK_HEALTH_DATA} />);

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

  it('should display table with periods sorted in descending order', () => {
    render(<LineChartTable data={MOCK_HEALTH_DATA} />);

    const sortedHealthData = {
      ...MOCK_HEALTH_DATA,
      healthData: MOCK_HEALTH_DATA.healthData.toSorted(
        (a, b) => b.year - a.year
      ),
    };

    for (let i = 0; i < MOCK_HEALTH_DATA.healthData.length; i++) {
      expect(screen.getAllByRole('cell')[i * CELLS_PER_ROW]).toHaveTextContent(
        String(sortedHealthData.healthData[i].year)
      );
    }
  });
});
