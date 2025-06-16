import html2canvas from 'html2canvas';

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

export const preCanvasConversion = (
  clonedDocument: Document,
  element: HTMLElement
) => {
  const chartPageContent = clonedDocument.getElementById('chartPageContent');
  if (!chartPageContent) return;

  chartPageContent.style.width = 'min-content';
  element.style.width = 'min-content';

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
