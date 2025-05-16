import { FC, useRef } from 'react';
import html2canvas from 'html2canvas';

interface ExportPreviewProps {
  targetId?: string;
}

export const ExportPreview: FC<ExportPreviewProps> = ({ targetId }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  if (!targetId) return;
  const element = document.getElementById(targetId);
  if (!element) return;

  const parent = element.parentElement;

  if (!parent) return;
  parent.style.overflowX = 'visible';

  html2canvas(element).then((canvas) => {
    parent.style.removeProperty('overflow-x');
    // const scale = window.devicePixelRatio;

    if (!canvasRef.current || !linkRef.current) return;

    canvasRef.current.replaceChildren(canvas);
    // previewContent.style.transform = `translate(-${canvas.width / (2 * scale)}px, -${canvas.height / (2 * scale)}px)`;

    linkRef.current.download = `${targetId}.png`;
    linkRef.current.href = canvas.toDataURL();
  });

  return (
    <div>
      <div ref={canvasRef}></div>
      <a ref={linkRef} href={''}></a>
    </div>
  );
};
