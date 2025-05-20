import { Button } from 'govuk-react';
import { FC, SyntheticEvent } from 'react';
import {
  canvasToBlob,
  triggerBlobDownload,
} from '@/components/molecules/Export/exportHelpers';

interface ExportDownloadButtonProps {
  fileName: string;
  download: HTMLCanvasElement | string;
  enabled: boolean;
}

export const ExportDownloadButton: FC<ExportDownloadButtonProps> = ({
  fileName,
  download,
  enabled = false,
}) => {
  const onClick = async (e: SyntheticEvent) => {
    e.preventDefault();
    const isString = typeof download === 'string';
    const isSvg = isString && download.startsWith('<svg');
    const blob = isString
      ? new Blob([download], {
          type: `${isSvg ? 'image/svg+xml' : 'text/csv'};charset=utf-8`,
        })
      : await canvasToBlob(download as HTMLCanvasElement);

    if (!blob || blob.size === 0) {
      console.log('Invalid blob', { isSvg, isString, blob });
      return;
    }
    triggerBlobDownload(fileName, blob);
  };

  return (
    <Button style={{ marginBottom: 0 }} onClick={onClick} disabled={!enabled}>
      Export
    </Button>
  );
};
