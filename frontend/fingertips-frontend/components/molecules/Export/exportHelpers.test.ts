import {
  canvasToBlob,
  ExcludeFromExport,
  ExportOnly,
  getHtmlToImageCanvas,
  preCanvasConversion,
  triggerBlobDownload,
} from '@/components/molecules/Export/exportHelpers';
import html2canvas from 'html2canvas';
import { Mock, MockInstance } from 'vitest';

vi.mock('html2canvas', () => {
  return { default: vi.fn() };
});

describe('exportHelpers', () => {
  describe('getHtmlToImageCanvas', () => {
    let mockElement: HTMLElement;
    let mockParent: HTMLElement;
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      mockParent = document.createElement('div');
      mockParent.appendChild(mockElement);
      mockElement.id = 'test-id';
      document.body.appendChild(mockParent);

      mockCanvas = document.createElement('canvas');
      (html2canvas as Mock).mockResolvedValue(mockCanvas);
    });

    afterEach(() => {
      document.body.innerHTML = '';
      vi.clearAllMocks();
    });

    it('returns undefined if element is not found', async () => {
      const result = await getHtmlToImageCanvas('non-existent-id');
      expect(result).toBeUndefined();
      expect(html2canvas).not.toHaveBeenCalled();
    });

    it('calls html2canvas and returns canvas with modified styles', async () => {
      const result = await getHtmlToImageCanvas('test-id');

      expect(html2canvas).toHaveBeenCalledWith(mockElement, {
        scale: 2.5,
        onclone: preCanvasConversion,
      });
      expect(result).toBe(mockCanvas);
      expect(result?.style.width).toBe('100%');
      expect(result?.style.height).toBe('auto');
      expect(mockParent.style.overflowX).toBe('');
    });

    describe('preCanvasConversion', () => {
      let clonedDocument: Document;
      let clonedElement: HTMLElement;

      beforeEach(() => {
        clonedDocument =
          document.implementation.createHTMLDocument('Test Document');
        clonedElement = clonedDocument.createElement('div');

        const chartPageContent = clonedDocument.createElement('div');
        chartPageContent.id = 'chartPageContent';
        clonedDocument.body.appendChild(chartPageContent);

        const elementToBeExcluded = clonedDocument.createElement('div');
        elementToBeExcluded.className = ExcludeFromExport;
        const mapNavigation = clonedDocument.createElement('div');
        mapNavigation.className = 'highcharts-map-navigation';
        const highChartsTooltip = clonedDocument.createElement('div');
        highChartsTooltip.className = 'highcharts-tooltip';
        clonedDocument.body.appendChild(elementToBeExcluded);
        clonedDocument.body.appendChild(mapNavigation);
        clonedDocument.body.appendChild(highChartsTooltip);

        const exportOnlyElement = clonedDocument.createElement('div');
        exportOnlyElement.className = ExportOnly;
        exportOnlyElement.style.display = 'none';
        clonedDocument.body.appendChild(exportOnlyElement);
      });

      it('removes elements with specific class names', () => {
        preCanvasConversion(clonedDocument, clonedElement);
        expect(
          clonedDocument.querySelector(`.${ExcludeFromExport}`)
        ).toBeNull();
        expect(
          clonedDocument.querySelector('.highcharts-map-navigation')
        ).toBeNull();
        expect(clonedDocument.querySelector('.highcharts-tooltip')).toBeNull();
      });

      it('makes elements with ExportOnly class visible', () => {
        const exportOnly = clonedDocument.querySelector(
          `.${ExportOnly}`
        ) as HTMLElement;
        expect(exportOnly.style.display).toBe('none');

        preCanvasConversion(clonedDocument, clonedElement);
        expect(exportOnly.style.display).toBe('block');
      });

      it('does nothing if #chartPageContent is missing', () => {
        const doc =
          document.implementation.createHTMLDocument('No chart content');
        expect(() => preCanvasConversion(doc, clonedElement)).not.toThrow();
      });
    });
  });

  describe('canvasToBlob', () => {
    it('resolves with a Blob when canvas.toBlob is called', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/png' });

      const canvas = document.createElement('canvas');
      canvas.toBlob = (callback: (blob: Blob | null) => void) => {
        callback(mockBlob);
      };

      const result = await canvasToBlob(canvas);

      expect(result).toBeInstanceOf(Blob);
      expect(result?.type).toBe('image/png');
    });

    it('resolves with null if toBlob returns null', async () => {
      const canvas = document.createElement('canvas');

      canvas.toBlob = (callback: (blob: Blob | null) => void) => {
        callback(null);
      };

      const result = await canvasToBlob(canvas);

      expect(result).toBeNull();
    });
  });

  describe('triggerBlobDownload', () => {
    let createObjectURLSpy: MockInstance;
    let revokeObjectURLSpy: MockInstance;
    let createElementSpy: MockInstance;
    let appendChildSpy: MockInstance;
    let removeChildSpy: MockInstance;
    const mockLink = document.createElement('a');
    mockLink.click = vi.fn();

    beforeEach(() => {
      // Define createObjectURL if it doesn't exist
      if (!URL.createObjectURL) {
        URL.createObjectURL = vi.fn();
      }
      if (!URL.revokeObjectURL) {
        URL.revokeObjectURL = vi.fn();
      }
      createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:http://fake-url');
      revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});
      createElementSpy = vi.spyOn(document, 'createElement');
      createElementSpy.mockImplementation(() => mockLink);
      appendChildSpy = vi.spyOn(document.body, 'appendChild');
      removeChildSpy = vi.spyOn(document.body, 'removeChild');
      document.body.innerHTML = ''; // Clean up any existing elements
    });

    it('creates a link, triggers a download, and cleans up', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const fileName = 'test.txt';

      triggerBlobDownload(fileName, blob);

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://fake-url');

      expect(mockLink).toHaveProperty('href', 'blob:http://fake-url');
      expect(mockLink).toHaveProperty('download', fileName);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
