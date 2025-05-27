import html2canvas from 'html2canvas';
import Highcharts from 'highcharts';

export const getHtmlToImageCanvas = async (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2.5,
    onclone: (clonedDocument) => {
      const chartPageContent =
        clonedDocument.getElementById('chartPageContent');
      if (!chartPageContent) return;
      chartPageContent.style.width = 'min-content';
    },
  });
  canvas.style.width = '100%';
  canvas.style.height = 'auto';

  return canvas;
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

  // type issue with mapChart existing (or not) on the Highcharts object - it does
  // maybe because the loading of highcharts modules is done before this code is executed
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const constructor = options.mapView ? Highcharts.mapChart : Highcharts.chart;

  const chart = constructor(container, options);
  const svg = chart.getSVG();

  chart.destroy();
  document.body.removeChild(container);

  return svg;
};
