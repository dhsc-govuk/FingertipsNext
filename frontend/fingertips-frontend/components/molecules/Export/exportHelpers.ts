import html2canvas from 'html2canvas';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { Chart } from 'highcharts';

export const getHtmlToImageCanvas = async (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;
  const parent = element.parentElement;

  if (!parent) return;
  parent.style.overflowX = 'visible';

  // const fontBold = await new FontFace(
  //   'gdsTransportFont',
  //   `url('/fonts/GDSTransportBold.ttf')`,
  //   { style: 'normal', weight: '700' }
  // ).load();
  //
  // const fontLight = await new FontFace(
  //   'gdsTransportFont',
  //   `url('/fonts/GDSTransportLight.ttf')`,
  //   { style: 'normal', weight: '400' }
  // ).load();

  const canvas = await html2canvas(element, {
    scale: 2.5,
    // onclone: async (document) => {
    //   console.log('Onclone');
    //   document.fonts.add(fontBold);
    //   document.fonts.add(fontLight);
    //   await document.fonts.ready;
    // },
  });
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  parent.style.removeProperty('overflow-x');

  return canvas;
};

export const updatePreviewWithHtmlAsImage = async (
  targetId: string,
  setPreview: Dispatch<SetStateAction<string | HTMLCanvasElement | null>>
) => {
  if (!targetId) return;

  const canvas = await getHtmlToImageCanvas(targetId);
  setPreview(canvas ?? null);
  // if (!canvas) return;
  //
  // previewElement.replaceChildren(canvas);
  // linkElement.href = canvas.toDataURL('image/png');
};

export const chartToSvg = (chartRef: RefObject<Chart>) => {
  const backupOfChart = chartRef.current;
  const svgString = chartRef?.current.getSVG();
  chartRef.current = backupOfChart;
  return svgString;
};

export const svgStringToDomElement = (svgString: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
};

export const canvasToBlob = (canvas: HTMLCanvasElement) => {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob: Blob | null) => {
      resolve(blob);
    });
  });
};
