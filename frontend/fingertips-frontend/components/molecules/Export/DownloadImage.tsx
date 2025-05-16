'use client';

import html2canvas from 'html2canvas';
import { FC, RefObject, SyntheticEvent } from 'react';
import { Chart } from 'highcharts';
import { useModal } from '@/context/ModalContext';
import { ExportPreview } from '@/components/molecules/Export/ExportPreview';

const getElements = () => {
  const preview = document.getElementById('DownloadImagePreview');
  const previewContent = document.getElementById(
    'DownloadImagePreview-content'
  );
  const previewCanvas = document.getElementById('DownloadImagePreview-canvas');
  const previewLink = document.getElementById(
    'DownloadImagePreview-link'
  ) as HTMLAnchorElement;

  return { preview, previewContent, previewLink, previewCanvas };
};

interface DownloadImageProps {
  target: string;
  chart?: RefObject<Chart | undefined>;
}

export const DownloadImage: FC<DownloadImageProps> = ({ target, chart }) => {
  const { setModal } = useModal();
  const onPreview = (e: SyntheticEvent) => {
    e.preventDefault();

    const exportPreview = <ExportPreview targetId={target} />;

    setModal({ content: exportPreview, title: 'Export options' });
  };

  const onDownloadSvg = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!chart || !chart.current) return;
    const { preview, previewCanvas } = getElements();
    const chartBackup = chart.current;
    const svgString = chart.current.getSVG();
    chart.current = chartBackup;

    console.log({ svgString });
    if (!svgString) return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    const wrapperGroup = svgDoc.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    wrapperGroup.setAttribute('id', 'wrapped-content');

    const nodesToWrap = [];
    for (const child of Array.from(svgElement.childNodes)) {
      if (!(child.nodeType === 1 && child.nodeName.toLowerCase() === 'defs')) {
        nodesToWrap.push(child);
      }
    }

    nodesToWrap.forEach((node) => wrapperGroup.appendChild(node));
    svgElement.appendChild(wrapperGroup);

    svgElement.setAttribute('height', '1000');
    svgElement.setAttribute('width', '600');
    svgElement.setAttribute('viewBox', '0 0 600 1000');

    const text = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '100');
    text.setAttribute('y', '100');
    text.setAttribute('fill', 'blue');
    text.textContent = 'Preview Label';
    wrapperGroup.appendChild(text);

    if (!preview || !previewCanvas) return;
    preview.style.display = 'block';
    previewCanvas.replaceChildren(svgElement);
  };

  const onDownloadImage = (e: SyntheticEvent) => {
    e.preventDefault();
    const { preview, previewContent, previewLink, previewCanvas } =
      getElements();
    const element = document.getElementById(target);
    if (!element) return;

    const parent = element.parentElement;

    if (!parent) return;
    parent.style.overflowX = 'visible';

    const isPreviewAvailable =
      preview && previewContent && previewLink && previewCanvas;

    html2canvas(element).then((canvas) => {
      parent.style.removeProperty('overflow-x');
      const scale = window.devicePixelRatio;
      if (isPreviewAvailable) {
        preview.style.display = 'block';

        previewCanvas.replaceChildren(canvas);
        previewContent.style.transform = `translate(-${canvas.width / (2 * scale)}px, -${canvas.height / (2 * scale)}px)`;

        previewLink.download = `${target}.png`;
        previewLink.href = canvas.toDataURL();
        return;
      }

      const link = document.createElement('a');
      link.download = `${target}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <>
      <button onClick={onDownloadImage}>Image</button>
      <button onClick={onDownloadSvg}>Svg</button>
      <button onClick={onPreview}>Preview</button>
    </>
  );
};
