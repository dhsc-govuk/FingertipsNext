import { act, render, screen, waitFor } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { createLineChartOptions, LineChartVariant } from './lineChartHelpers';

const lineChartDefaultOptions = createLineChartOptions([]);
const mockSeries = [
  {
    color: '#F46A25',
    custom: { areaCode: 'A1425' },
    data: [
      [2004, 278.29134],
      [2006, 703.420759],
    ],
    name: 'North FooBar',
    type: 'line',
    marker: {
      symbol: 'arc',
    },
  },
  {
    color: '#B1B4B6',
    data: [
      [2004, 441.69151, 578.32766],
      [2006, 441.69151, 578.32766],
    ],
    name: 'North FooBar',
    linkedTo: 'North FooBar',
    type: 'errorbar',
    visible: true,
    lineWidth: 2,
    whiskerLength: '20%',
  },
];

describe('LineChart', () => {
  it('should render the Highcharts react component with passed parameters within the LineChart component', async () => {
    act(() => {
      render(
        <LineChart
          lineChartOptions={lineChartDefaultOptions}
          variant={LineChartVariant.Standard}
        />
      );
    });

    const highcharts = await screen.findByTestId(
      'highcharts-react-component-lineChart'
    );

    await waitFor(() => {
      expect(highcharts).toBeInTheDocument();
    });
  });

  it('should mutate the lineChartOptions object to add visibility event functions', async () => {
    const lineChartOptions = JSON.parse(
      JSON.stringify(lineChartDefaultOptions)
    );
    lineChartOptions.series = mockSeries;
    act(() => {
      render(
        <LineChart
          lineChartOptions={lineChartOptions}
          variant={LineChartVariant.Standard}
        />
      );
    });
    const highcharts = await screen.findByTestId(
      'highcharts-react-component-lineChart'
    );

    const checkBox = screen.getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).not.toBeChecked();

    await waitFor(() => {
      expect(highcharts).toBeInTheDocument();
    });

    expect(lineChartOptions.series[0].events).toBeDefined();
    expect(lineChartOptions.series[0].events.show).toBeDefined();
    expect(lineChartOptions.series[0].events.hide).toBeDefined();
    expect(lineChartOptions.series[1].visible).toBeFalsy();
  });
});
