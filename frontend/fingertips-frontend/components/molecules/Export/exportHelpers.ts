import html2canvas from 'html2canvas';
import { RefObject } from 'react';
import { Chart } from 'highcharts';

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

export const chartToSvg = (chartRef: RefObject<Chart>) => {
  // When getSVG is called on a chart, it cannot be called again
  // this is why the chart object is captured first, run getSVG and then reset after
  // even though this should be the same thing it works
  // [TODO] investigate reliable cloning of the chart object
  const backupOfChart = chartRef.current;
  const svgString = chartRef.current?.getSVG();
  chartRef.current = backupOfChart;
  return svgString;
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
