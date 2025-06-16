import { svgClone } from '@/components/molecules/Export/helpers/svgClone';
import { ElementInfo } from '@/components/molecules/Export/export.types';

describe('svgClone', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should clone the element and return correct width and height', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'test-svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '100');

    document.body.appendChild(svg);

    const result: ElementInfo = svgClone('#test-svg');

    expect(result.element).toBeDefined();
    expect(result.width).toBe(200);
    expect(result.height).toBe(100);
  });

  it('should return undefined element and 0 dimensions if element not found', () => {
    const result: ElementInfo = svgClone('#non-existent');

    expect(result.element).toBeUndefined();
    expect(result.width).toBe(0);
    expect(result.height).toBe(0);
  });

  it('should return 0 dimensions if width/height attributes are missing', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'svg-no-dimensions');

    document.body.appendChild(svg);

    const result = svgClone('#svg-no-dimensions');

    expect(result.element).toBeDefined();
    expect(result.width).toBe(0);
    expect(result.height).toBe(0);
  });
});
