import { svgStringFromChartOptions } from '@/components/molecules/Export/helpers/svgStringFromChartOptions';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts';

jest.mock('highcharts', () => {
  return {
    chart: jest.fn(),
  };
});

describe('svgStringFromChartOptions', () => {
  let mockChart: Chart;

  beforeEach(() => {
    mockChart = {
      getSVG: jest.fn().mockReturnValue('<svg>mocked</svg>'),
      destroy: jest.fn(),
    } as unknown as Chart;
    (Highcharts.chart as jest.Mock).mockReturnValue(mockChart);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a chart, get its SVG, destroy the chart, and remove the container', () => {
    const options = { title: { text: 'Test Chart' } };

    const svg = svgStringFromChartOptions(options);

    expect(Highcharts.chart).toHaveBeenCalled();
    expect(mockChart.getSVG).toHaveBeenCalled();
    expect(mockChart.destroy).toHaveBeenCalled();
    expect(svg).toBe('<svg>mocked</svg>');

    // Ensure the container is removed from the DOM
    const containerInDom = Array.from(document.body.children).find(
      (child) => child.tagName === 'DIV'
    );
    expect(containerInDom).toBeUndefined();
  });
});
