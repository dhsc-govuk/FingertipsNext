import { ElementInfo } from '@/components/molecules/Export/export.types';

export const svgClone = (selector: string): ElementInfo => {
  const originalElement = document.querySelector(selector);
  const clonedElement = originalElement?.cloneNode(true);
  if (!clonedElement) {
    return { element: undefined, width: 0, height: 0 };
  }
  const element = clonedElement as HTMLElement;
  const width = element ? Number(element.getAttribute('width')) : 0;
  const height = element ? Number(element.getAttribute('height')) : 0;

  return { element, width, height };
};
