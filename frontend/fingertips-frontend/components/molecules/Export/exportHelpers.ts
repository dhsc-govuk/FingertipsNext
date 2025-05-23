import html2canvas from 'html2canvas';
import Highcharts from 'highcharts';

export const getHtmlToImageCanvas = async (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;
  const parent = element.parentElement;

  if (!parent) return;
  parent.style.overflowX = 'visible';

  const canvas = await html2canvas(element, {
    scale: 2.5,
  });
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  parent.style.removeProperty('overflow-x');

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

  const chart = Highcharts.chart(container, options);
  const svg = chart.getSVG();

  chart.destroy();
  document.body.removeChild(container);

  return svg;
};
