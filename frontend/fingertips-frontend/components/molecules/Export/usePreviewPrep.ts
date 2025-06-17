import { useQuery } from '@tanstack/react-query';
import { ExportType } from '@/components/molecules/Export/export.types';
import { getHtmlToImageCanvas } from '@/components/molecules/Export/exportHelpers';
import { Options } from 'highcharts';
import { convertToCsv, CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { svgClone } from '@/components/molecules/Export/helpers/svgClone';
import { svgFromString } from '@/components/molecules/Export/helpers/svgFromString';
import { svgStringFromChartOptions } from '@/components/molecules/Export/helpers/svgStringFromChartOptions';
import { chartOptionsAddFooter } from '@/components/molecules/Export/helpers/chartOptionsAddFooter';
import { svgWithChartAndLegend } from '@/components/molecules/Export/helpers/svgWithChartAndLegend';
import { svgStringFromElement } from '@/components/molecules/Export/helpers/svgStringFromElement';

export interface PreviewPrep {
  element?: HTMLElement | HTMLCanvasElement | SVGSVGElement;
  text: string;
}

export const usePreviewPrep = (
  targetId: string,
  format: ExportType,
  csvData?: CsvData,
  chartOptions?: Options
) => {
  const query = useQuery<PreviewPrep>({
    queryKey: [targetId, format],
    queryFn: async () => {
      const result: PreviewPrep = {
        text: '',
      };
      switch (format) {
        case ExportType.PNG: {
          result.element = await getHtmlToImageCanvas(targetId);
          return result;
        }
        case ExportType.SVG: {
          if (!chartOptions) {
            throw new Error('invalid chartRef');
          }

          const legend = svgClone(`#${targetId} .svgBenchmarkLegend`);
          const optionsWithFooter = chartOptionsAddFooter(chartOptions);
          const svgChartString = svgStringFromChartOptions(optionsWithFooter);
          const chart = svgFromString(svgChartString);
          const svg = svgWithChartAndLegend(chart, legend);
          if (svg) {
            return { text: svgStringFromElement(svg), element: svg };
          }

          return { text: svgChartString, element: chart.element };
        }
        case ExportType.CSV: {
          if (!csvData) {
            throw new Error('invalid csvData');
          }
          result.text = convertToCsv(csvData);
          return result;
        }
      }
    },
    staleTime: 1000,
  });

  const { element = undefined, text = '' } = query.data ?? {};
  return { element, text, ...query };
};
