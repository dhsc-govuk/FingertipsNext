import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExportDownloadButton } from './ExportDownloadButton';
import userEvent from '@testing-library/user-event';
import {
  canvasToBlob,
  triggerBlobDownload,
} from '@/components/molecules/Export/exportHelpers';

jest.mock('./exportHelpers.ts', () => ({
  triggerBlobDownload: jest.fn(),
  canvasToBlob: jest.fn(),
}));

const mockTriggerBlobDownload = triggerBlobDownload as jest.Mock;
const mockCanvasToBlob = canvasToBlob as jest.Mock;
mockCanvasToBlob.mockResolvedValue(new Blob(['fake'], { type: 'image/png' }));

describe('ExportDownloadButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button', () => {
    render(
      <ExportDownloadButton
        fileName="testFile.svg"
        download="<svg></svg>"
        enabled={true}
      />
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('Export');
  });

  it('calls triggerBlobDownload for SVG when clicked', async () => {
    render(
      <ExportDownloadButton
        fileName="scalableImage.svg"
        download="<svg></svg>"
        enabled={true}
      />
    );

    const btn = screen.getByRole('button');
    await userEvent.click(btn);

    expect(mockTriggerBlobDownload).toHaveBeenCalledWith(
      'scalableImage.svg',
      expect.any(Blob)
    );
    const blob = mockTriggerBlobDownload.mock.calls[0][1];
    expect(blob.size).toBe(11);
    expect(blob.type).toBe('image/svg+xml;charset=utf-8');
  });

  it('calls triggerBlobDownload for CSV when clicked', async () => {
    render(
      <ExportDownloadButton
        fileName="someData.csv"
        download="a,b,c\n1,2,3\n4,5,6"
        enabled={true}
      />
    );

    const btn = screen.getByRole('button');
    await userEvent.click(btn);

    expect(mockTriggerBlobDownload).toHaveBeenCalledWith(
      'someData.csv',
      expect.any(Blob)
    );
    const blob = mockTriggerBlobDownload.mock.calls[0][1];
    expect(blob.size).toBe(19);
    expect(blob.type).toBe('text/csv;charset=utf-8');
  });

  it('calls canvasToBlob and triggerBlobDownload for PNG when clicked', async () => {
    const canvas = document.createElement('canvas');

    render(
      <ExportDownloadButton
        fileName="canvasToImage.png"
        download={canvas}
        enabled={true}
      />
    );

    const btn = screen.getByRole('button');
    await userEvent.click(btn);

    expect(mockCanvasToBlob).toHaveBeenCalledWith(canvas);

    expect(mockTriggerBlobDownload).toHaveBeenCalledWith(
      'canvasToImage.png',
      expect.any(Blob)
    );
    const blob = mockTriggerBlobDownload.mock.calls[0][1];
    expect(blob.size).toBe(4);
    expect(blob.type).toBe('image/png');
  });
});
