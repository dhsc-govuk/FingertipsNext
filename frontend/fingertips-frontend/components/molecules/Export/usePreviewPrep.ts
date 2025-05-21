import { useQuery } from '@tanstack/react-query';
import { ExportType } from '@/components/molecules/Export/export.types';
import {
  chartToSvg,
  getHtmlToImageCanvas,
  svgStringToDomElement,
} from '@/components/molecules/Export/exportHelpers';
import { Chart } from 'highcharts';
import { convertToCsv, CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { RefObject } from 'react';

export interface PreviewPrep {
  element?: HTMLElement | HTMLCanvasElement;
  text: string;
}

export const usePreviewPrep = (
  targetId: string,
  format: ExportType,
  chartRef?: RefObject<Chart | undefined>,
  csvData?: CsvData
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
          if (!chartRef?.current) {
            throw new Error('invalid chartRef');
          }
          const svgString = chartToSvg(chartRef as RefObject<Chart>);
          const svgElement = svgStringToDomElement(svgString);
          return { text: svgString, element: svgElement };
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
