import { svgFromString } from '@/components/molecules/Export/helpers/svgFromString';

describe('svgFromString', () => {
  it('parses a valid SVG string into an SVGElement', () => {
    const svgString = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="50" cy="50" r="40" stroke="black" fill="red" />
                       </svg>`;

    const { element, width, height } = svgFromString(svgString);

    expect(element).toBeInstanceOf(SVGElement);
    expect(element?.nodeName).toBe('svg');
    expect(width).toBe(600);
    expect(height).toBe(400);
  });

  it('returns a undefined for invalid SVG', () => {
    const badSvg = `<svg><g><circle r="1"></svg>`; // malformed
    const { element } = svgFromString(badSvg);
    expect(element).toBeUndefined();
  });
});
