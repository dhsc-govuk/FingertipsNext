import { render } from '@testing-library/react';
import { Chart } from '@/components/pages/chart';
import { mockHealthData } from '@/mock/data/healthdata';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';

jest.mock('@/components/organisms/LineChart/');
const mockLineChart = jest.mocked(LineChart);
jest.mock('@/components/organisms/LineChartTable');
const mockLineChartTable = jest.mocked(LineChartTable);

describe('Chart', () => {
  it('line chart component should not pass data for England as groupData to the lineChart or lineChartTable', () => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        indicatorsSelected={['0']}
        selectedGroupCode="E92000001"
      />
    );

    expect(mockLineChart.mock.lastCall).toMatchObject([
      { groupIndicatorData: undefined },
    ]);
    expect(mockLineChartTable.mock.lastCall).toMatchObject([
      { groupIndicatorData: undefined },
    ]);
  });
});
