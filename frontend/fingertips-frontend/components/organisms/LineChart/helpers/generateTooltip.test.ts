import { generateTooltip } from './generateTooltip';
import { mockIndicatorData, mockEnglandData, mockParentData } from '../mocks';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';

describe('generateTooltip', () => {
  it('should return a Highcharts.TooltipOptions object', () => {
    const tooltipOptions = generateTooltip(mockIndicatorData);

    expect(tooltipOptions).toHaveProperty('headerFormat', '');
    expect(tooltipOptions).toHaveProperty('formatter');
    expect(tooltipOptions).toHaveProperty('useHTML', true);
    expect(typeof tooltipOptions.formatter).toBe('function');
  });

  it('should generate tooltip content for a point', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      mockEnglandData,
      mockParentData,
      BenchmarkComparisonMethod.Unknown,
      '%'
    );
    // Mock a Highcharts.Point-like object
    const mockPoint = {
      x: 2006,
      y: 278.29134,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: { custom: { areaCode: 'A1425' } },
      },
    };

    // @ts-expect-error something
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(typeof tooltipHtml).toBe('string');
    expect(tooltipHtml).toContain('North FooBar');
    expect(tooltipHtml).toContain('278.3'); // formatted value
    expect(tooltipHtml).toContain('%');
  });

  it('should handle missing benchmark and group data gracefully', () => {
    const tooltipOptions = generateTooltip(mockIndicatorData);
    const mockPoint = {
      x: 2004,
      y: 703.420759,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: { custom: { areaCode: 'A1425' } },
      },
    };

    // @ts-expect-error something
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(typeof tooltipHtml).toBe('string');
    expect(tooltipHtml).toContain('North FooBar');
  });

  it('should include the measurement unit if provided', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      undefined,
      undefined,
      undefined,
      'cases'
    );
    const mockPoint = {
      x: 2006,
      y: 278.29134,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: { custom: { areaCode: 'A1425' } },
      },
    };

    // @ts-expect-error something
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).toContain('cases');
  });
});
