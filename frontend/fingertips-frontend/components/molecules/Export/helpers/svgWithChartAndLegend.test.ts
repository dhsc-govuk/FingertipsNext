import { svgWithChartAndLegend } from '@/components/molecules/Export/helpers/svgWithChartAndLegend';
import { ElementInfo } from '@/components/molecules/Export/export.types';

describe('svgWithChartAndLegend', () => {
  const createSvgElement = (
    id: string,
    width: number,
    height: number,
    style?: string
  ): SVGSVGElement => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('id', id);
    el.setAttribute('width', `${width}`);
    el.setAttribute('height', `${height}`);
    if (style) el.setAttribute('style', style);
    return el;
  };

  it('returns a composed SVG with chart and legend', () => {
    const chartEl = createSvgElement('chart', 200, 150, 'background: #fff');
    const legendEl = createSvgElement('legend', 180, 50);

    const chartInfo: ElementInfo = {
      element: chartEl,
      width: 200,
      height: 150,
    };

    const legendInfo: ElementInfo = {
      element: legendEl,
      width: 180,
      height: 50,
    };

    const svg = svgWithChartAndLegend(chartInfo, legendInfo);
    expect(svg).toBeInstanceOf(SVGSVGElement);
    expect(svg?.getAttribute('width')).toBe('200px');
    expect(svg?.getAttribute('height')).toBe('200px'); // 150 + 50
    expect(svg?.getAttribute('viewBox')).toBe('0 0 200 200');
    expect(svg?.getAttribute('style')).toBe('background: #fff');

    const groups = svg?.querySelectorAll('g');
    expect(groups?.length).toBe(2);
    expect(groups?.[0]?.getAttribute('transform')).toBe('translate(10, 0)');
    expect(groups?.[1]?.getAttribute('transform')).toBe('translate(0, 50)');
  });

  it('returns null if chart or legend is missing', () => {
    const result1 = svgWithChartAndLegend(
      { element: undefined, width: 100, height: 100 },
      {
        element: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        width: 100,
        height: 100,
      }
    );
    expect(result1).toBeNull();

    const result2 = svgWithChartAndLegend(
      {
        element: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        width: 100,
        height: 0,
      },
      {
        element: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        width: 100,
        height: 100,
      }
    );
    expect(result2).toBeNull();
  });
});
