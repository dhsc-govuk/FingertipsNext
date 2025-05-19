import { Button } from 'govuk-react';
import { FC, SyntheticEvent } from 'react';
import { ExportType } from '@/components/molecules/Export/export.types';
import { canvasToBlob } from '@/components/molecules/Export/exportHelpers';

interface ExportDownloadButtonProps {
  baseName: string;
  format: ExportType;
  download: HTMLCanvasElement | string;
  enabled: boolean;
}

export const ExportDownloadButton: FC<ExportDownloadButtonProps> = ({
  baseName,
  format,
  download,
  enabled = false,
}) => {
  const onClick = async (e: SyntheticEvent) => {
    e.preventDefault();
    const filename = `${baseName}.${format}`;
    let blob: Blob | null = null;

    switch (format) {
      case ExportType.SVG:
        blob = new Blob([download as string], {
          type: 'image/svg+xml;charset=utf-8',
        });
        break;
      case ExportType.PNG:
        blob = await canvasToBlob(download as HTMLCanvasElement);
        break;
      case ExportType.CSV:
        blob = new Blob([download as string], {
          type: 'text/csv;charset=utf-8',
        });
        break;
    }

    if (!blob) return;

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Button style={{ marginBottom: 0 }} onClick={onClick} disabled={!enabled}>
      Export
    </Button>
  );
};
