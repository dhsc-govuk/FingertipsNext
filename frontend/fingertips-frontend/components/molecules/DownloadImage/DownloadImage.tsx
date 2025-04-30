'use client';

import html2canvas from 'html2canvas';
import { FC, SyntheticEvent } from 'react';

interface DownloadImageProps {
  target: string;
}

export const DownloadImage: FC<DownloadImageProps> = ({ target }) => {
  const onDownloadImage = (e: SyntheticEvent) => {
    e.preventDefault();
    const element = document.getElementById(target);
    const preview = document.getElementById('DownloadImagePreview');
    const previewContent = document.getElementById(
      'DownloadImagePreview-content'
    );
    const previewCanvas = document.getElementById(
      'DownloadImagePreview-canvas'
    );
    const previewLink = document.getElementById(
      'DownloadImagePreview-link'
    ) as HTMLAnchorElement;
    const isPreviewAvailable =
      preview && previewContent && previewLink && previewCanvas;
    if (!element) return;

    const parent = element.parentElement;

    if (!parent) return;
    parent.style.overflowX = 'visible';

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

  return <button onClick={onDownloadImage}>Image</button>;
};
