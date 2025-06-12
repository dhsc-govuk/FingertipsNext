import { ElementInfo } from '@/components/molecules/Export/export.types';

export const svgWithChartAndLegend = (
  chartInfo: ElementInfo,
  legendInfo: ElementInfo
) => {
  const { element: chart, width: chartW, height: chartH } = chartInfo;
  const { element: legend, width: legendW, height: legendH } = legendInfo;

  if (!chart || !legend) return null;
  if (!chartW || !chartH || !legendW || !legendH) return null;

  const overallWidth = Math.ceil(Math.max(legendW, chartW));
  const overallHeight = Math.ceil(legendH + chartH);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', `${overallWidth}px`);
  svg.setAttribute('height', `${overallHeight}px`);
  svg.setAttribute('viewBox', `0 0 ${overallWidth} ${overallHeight}`);
  svg.setAttribute('style', chart.getAttribute('style') ?? '');

  const legendGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  legendGroup.setAttribute('transform', `translate(10, 0)`);
  svg.appendChild(legendGroup);
  legendGroup.appendChild(legend);

  const chartGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  chartGroup.setAttribute('transform', `translate(0, ${legendH})`);
  svg.appendChild(chartGroup);
  chartGroup.appendChild(chart);

  return svg;
};
