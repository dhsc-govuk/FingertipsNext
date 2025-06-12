import { ElementInfo } from '@/components/molecules/Export/export.types';

export const svgFromString = (svgString: string): ElementInfo => {
  let svgDoc: Document;
  try {
    const parser = new DOMParser();
    svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  } catch (e) {
    console.error('Failed to parse SVG:', e);
    return { element: undefined, width: 0, height: 0 };
  }

  const parserError = svgDoc.querySelector('parsererror');
  if (parserError) {
    return { element: undefined, width: 0, height: 0 };
  }

  const element = svgDoc.documentElement;
  if (!element) {
    return { element: undefined, width: 0, height: 0 };
  }

  const width = Number(element.getAttribute('width'));
  const height = Number(element.getAttribute('height'));
  return { element, width, height };
};
