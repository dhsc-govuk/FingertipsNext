import { svgStringFromChartOptions } from '@/components/molecules/Export/helpers/svgStringFromChartOptions';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { Mock } from 'vitest';

vi.mock('highcharts', async () => {
  const originalModule = await vi.importActual('highcharts');
  return { default: { ...originalModule, chart: vi.fn() } };
});

describe('svgStringFromChartOptions', () => {
  let mockChart: Chart;

  beforeEach(() => {
    mockChart = {
      getSVG: vi.fn().mockReturnValue('<svg>mocked</svg>'),
      destroy: vi.fn(),
    } as unknown as Chart;
    (Highcharts.chart as Mock).mockReturnValue(mockChart);
  });

  afterEach(() => {
    vi.clearAllMocks();
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
