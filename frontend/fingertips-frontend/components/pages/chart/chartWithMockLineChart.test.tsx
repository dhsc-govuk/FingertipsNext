import { render } from '@testing-library/react';
import { Chart } from '@/components/pages/chart';
import { mockHealthData } from '@/mock/data/healthdata';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

jest.mock('@/components/organisms/LineChart/');
const mockLineChart = jest.mocked(LineChart);
jest.mock('@/components/organisms/LineChartTable');
const mockLineChartTable = jest.mocked(LineChartTable);

const state: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['0'],
  [SearchParams.GroupSelected]: 'E92000001',
};
describe('Chart', () => {
  it('line chart component should not pass data for England as groupData to the lineChart or lineChartTable', () => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        searchState={state}
      />
    );

    expect(mockLineChart.mock.lastCall).toBeUndefined();
    expect(mockLineChart.mock.lastCall).toEqual(undefined);
    expect(mockLineChartTable.mock.lastCall).toBeUndefined();
    expect(mockLineChartTable.mock.lastCall).toEqual(undefined);
  });
});
