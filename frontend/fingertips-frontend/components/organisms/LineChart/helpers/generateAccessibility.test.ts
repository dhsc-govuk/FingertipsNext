import { generateAccessibility } from './generateAccessibility';
import { lineChartDefaultOptions } from './generateStandardLineChartOptions';

describe('generateAccessibility', () => {
  it('should return default accessibility options when no label is provided', () => {
    const result = generateAccessibility();
    expect(result).toMatchObject({
      ...lineChartDefaultOptions.accessibility,
      description: undefined,
    });
  });

  it('should return accessibility options with a custom description', () => {
    const label = 'This is an accessible chart';
    const result = generateAccessibility(label);
    expect(result).toMatchObject({
      ...lineChartDefaultOptions.accessibility,
      description: label,
    });
  });
});
