import {
  canvasToBlob,
  getHtmlToImageCanvas,
  getSvgFromOptions,
  svgStringToDomElement,
  triggerBlobDownload,
} from '@/components/molecules/Export/exportHelpers';
import Highcharts, { Chart } from 'highcharts';
import html2canvas from 'html2canvas';

jest.mock('html2canvas', () => jest.fn());
jest.mock('highcharts', () => {
  return {
    chart: jest.fn(),
  };
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
      (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);
    });

    afterEach(() => {
      document.body.innerHTML = '';
      jest.clearAllMocks();
    });

    it('returns undefined if element is not found', async () => {
      const result = await getHtmlToImageCanvas('non-existent-id');
      expect(result).toBeUndefined();
      expect(html2canvas).not.toHaveBeenCalled();
    });

    it('calls html2canvas and returns canvas with modified styles', async () => {
      const result = await getHtmlToImageCanvas('test-id');

      expect(html2canvas).toHaveBeenCalledWith(mockElement, { scale: 2.5 });
      expect(result).toBe(mockCanvas);
      expect(result?.style.width).toBe('100%');
      expect(result?.style.height).toBe('auto');
      expect(mockParent.style.overflowX).toBe('');
    });
  });

  describe('svgStringToDomElement', () => {
    it('parses a valid SVG string into an SVGElement', () => {
      const svgString = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="50" cy="50" r="40" stroke="black" fill="red" />
                       </svg>`;

      const element = svgStringToDomElement(svgString) as HTMLElement;

      expect(element).toBeInstanceOf(SVGElement);
      expect(element.nodeName).toBe('svg');
      expect(element.getAttribute('width')).toBe('100');
      expect(element.getAttribute('height')).toBe('100');
    });

    it('returns a undefined for invalid SVG', () => {
      const badSvg = `<svg><g><circle></svg>`; // malformed
      const element = svgStringToDomElement(badSvg);
      expect(element).toBeUndefined();
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
    let createObjectURLSpy: jest.SpyInstance;
    let revokeObjectURLSpy: jest.SpyInstance;
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;
    const mockLink = document.createElement('a');
    mockLink.click = jest.fn();

    beforeEach(() => {
      // Define createObjectURL if it doesn't exist
      if (!URL.createObjectURL) {
        URL.createObjectURL = jest.fn();
      }
      if (!URL.revokeObjectURL) {
        URL.revokeObjectURL = jest.fn();
      }
      createObjectURLSpy = jest
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:http://fake-url');
      revokeObjectURLSpy = jest
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});
      createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockImplementation(() => mockLink);
      appendChildSpy = jest.spyOn(document.body, 'appendChild');
      removeChildSpy = jest.spyOn(document.body, 'removeChild');
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

  describe('getSvgFromOptions', () => {
    let mockChart: Chart;

    beforeEach(() => {
      mockChart = {
        getSVG: jest.fn().mockReturnValue('<svg>mocked</svg>'),
        destroy: jest.fn(),
      } as unknown as Chart;
      (Highcharts.chart as jest.Mock).mockReturnValue(mockChart);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a chart, get its SVG, destroy the chart, and remove the container', () => {
      const options = { title: { text: 'Test Chart' } };

      const svg = getSvgFromOptions(options);

      expect(Highcharts.chart).toHaveBeenCalled();
      expect(mockChart.getSVG).toHaveBeenCalled();
      expect(mockChart.destroy).toHaveBeenCalled();
      expect(svg).toBe('<svg>mocked</svg>');

      // Ensure the container is removed from the DOM
      const containerInDom = Array.from(document.body.children).find(
        (child) => child.tagName === 'DIV'
      );
      expect(containerInDom).toBeUndefined();
    });
  });
});
