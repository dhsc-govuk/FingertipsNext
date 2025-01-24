import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { LineChartTable } from '@/components/organisms/LineChartTable/index';
import { headings } from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';

describe('Line chart table suite', () => {
  const MOCK_HEALTH_DATA = mockHealthData['1'][0];
  const CELLS_PER_ROW = 7;

  it('snapshot test - should match snapshot', () => {
    const container = render(
      <LineChartTable data={MOCK_HEALTH_DATA} headings={headings} />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the LineChartTable component', () => {
    render(<LineChartTable data={MOCK_HEALTH_DATA} headings={headings} />);
    const lineChart = screen.getByTestId('lineChartTable-component');
    expect(lineChart).toBeInTheDocument();
  });

  it('should render expected elements', () => {
    render(<LineChartTable data={MOCK_HEALTH_DATA} headings={headings} />);

    const valueCellHeadings = screen
      .getAllByRole('columnheader')
      .filter((heading) => heading.textContent?.includes('Value'));

    expect(screen.getAllByRole('table')).toHaveLength(3);
    expect(screen.getAllByRole('columnheader')[2]).toHaveTextContent(
      MOCK_HEALTH_DATA.areaCode
    );
    expect(screen.getByText(/95% confidence limits/i)).toBeInTheDocument();
    expect(screen.getByText(/England/i)).toBeInTheDocument();
    expect(valueCellHeadings).toHaveLength(2);
    expect(screen.getAllByRole('cell')).toHaveLength(
      MOCK_HEALTH_DATA.healthData.length * CELLS_PER_ROW
    );

    headings
      .filter((heading) => heading.trim() !== 'Value')
      .forEach((heading) =>
        expect(screen.getByText(heading)).toBeInTheDocument()
      );
  });

  it('should display table with periods sorted in descending order', () => {
    render(<LineChartTable data={MOCK_HEALTH_DATA} headings={headings} />);

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
