import { svgStringFromElement } from '@/components/molecules/Export/helpers/svgStringFromElement';

describe('svgStringFromElement', () => {
  it('serializes an SVG element to a string', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '50');
    svg.innerHTML = '<rect x="10" y="10" width="30" height="20" fill="blue"/>';

    const result = svgStringFromElement(svg);
    expect(result).toEqual(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect x="10" y="10" width="30" height="20" fill="blue"/></svg>`
    );
  });

  it('returns a non-empty string', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const result = svgStringFromElement(svg);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
