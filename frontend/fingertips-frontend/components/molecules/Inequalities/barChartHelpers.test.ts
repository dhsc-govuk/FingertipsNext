import { getBarChartOptions } from './BarChart/barChartHelpers';

describe('getBarChartOptions', () => {
  it('should return an object matching the snapshot', () => {
    const barChartOptions = getBarChartOptions({
      height: '73%',
      xAxisTitleText: 'X Axis Title',
      xAxisCategories: ['Category 1', 'Category 2'],
      yAxisTitleText: 'Y Axis Title',
      yAxisMax: 150,
      plotLineLabel: 'Plot line',
      plotLineValue: 75,
      seriesData: [],
      tooltipAreaName: 'Tooltip Area',
      tooltipPointFormatter: jest.fn(),
    });

    expect(barChartOptions).toMatchSnapshot();
  });

  it('should return an object matching the snapshot when only mandatory parameters are supplied', () => {
    const barChartOptions = getBarChartOptions({
      seriesData: [],
      tooltipAreaName: 'Tooltip Area',
      tooltipPointFormatter: jest.fn(),
    });

    expect(barChartOptions).toMatchSnapshot();
  });
});
