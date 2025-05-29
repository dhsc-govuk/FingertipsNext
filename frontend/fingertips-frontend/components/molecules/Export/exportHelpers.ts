import html2canvas from 'html2canvas';
import Highcharts from 'highcharts';
import {
  exportAccessedDate,
  exportCopyrightText,
} from '@/components/molecules/Export/ExportCopyright';

export const ExcludeFromExport = 'excludeFromExport';

export const ExportOnly = 'exportOnly';

export const getHtmlToImageCanvas = async (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2.5,
    onclone: preCanvasConversion,
  });
  canvas.style.width = '100%';
  canvas.style.height = 'auto';

  return canvas;
};

export const preCanvasConversion = (clonedDocument: Document) => {
  const chartPageContent = clonedDocument.getElementById('chartPageContent');
  if (!chartPageContent) return;

  chartPageContent.style.width = 'min-content';

  // remove elements with these classnames before rendering
  const elementsToRemove = clonedDocument.querySelectorAll(
    `.${ExcludeFromExport}, .highcharts-map-navigation, .highcharts-tooltip`
  );
  elementsToRemove.forEach((element) => {
    element.remove();
  });

  // show items hidden from screen but to include in the export
  const elementsToShow = clonedDocument.querySelectorAll(`.${ExportOnly}`);
  elementsToShow.forEach((element) => {
    (element as HTMLElement).style.display = 'block';
  });
};

export const svgStringToDomElement = (svgString: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const element = svgDoc.documentElement;
  return element.nodeName === 'svg' ? element : undefined;
};

export const canvasToBlob = (canvas: HTMLCanvasElement) => {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob: Blob | null) => {
      resolve(blob);
    });
  });
};

export const triggerBlobDownload = (fileName: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const getSvgFromOptions = (options: Highcharts.Options): string => {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  const optionsWithFooter = addCopyrightFooterToChartOptions(options);

  // type issue with mapChart existing (or not) on the Highcharts object - it does
  // maybe because the loading of highcharts modules is done before this code is executed
  const constructor = optionsWithFooter.mapView
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Highcharts.mapChart
    : Highcharts.chart;

  const chart = constructor(container, optionsWithFooter);
  const svg = chart.getSVG();

  chart.destroy();
  document.body.removeChild(container);

  return svg;
};

export const addCopyrightFooterToChartOptions = (
  options: Highcharts.Options
) => {
  const modifiedEvents = { ...options.chart?.events };
  const modifiedChart = { ...options.chart, events: modifiedEvents };
  const modifiedOptions = { ...options, chart: modifiedChart };

  modifiedOptions.chart.spacingBottom = 75;
  modifiedEvents.load = function () {
    this.renderer
      .text(exportCopyrightText(), 4, this.chartHeight - 28)
      .css({
        color: '#000',
        fontSize: '14px',
      })
      .add();

    this.renderer
      .text(exportAccessedDate(), 4, this.chartHeight - 10)
      .css({
        color: '#000',
        fontSize: '14px',
      })
      .add();
  };
  return modifiedOptions;
};
