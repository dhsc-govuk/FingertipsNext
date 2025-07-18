import { generateTooltip } from './generateTooltip';
import { mockIndicatorData } from '../mocks';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

describe('generateTooltip', () => {
  const mockXCategoryKeys = mockIndicatorData[0].healthData.map((point) =>
    convertDateToNumber(point.datePeriod?.from)
  );

  it('should return a Highcharts.TooltipOptions object', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland
    );

    expect(tooltipOptions).toHaveProperty('headerFormat', '');
    expect(tooltipOptions).toHaveProperty('formatter');
    expect(tooltipOptions).toHaveProperty('useHTML', true);
    expect(typeof tooltipOptions.formatter).toBe('function');
  });

  it('should generate tooltip content for a point', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      BenchmarkComparisonMethod.Unknown,
      '%'
    );

    const mockPoint = {
      x: 0,
      y: 278.29134,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: {
          custom: { areaCode: 'A1425', xCategoryKeys: mockXCategoryKeys },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions?.formatter?.call(mockPoint);
    expect(tooltipHtml).toContain('North FooBar');
    expect(tooltipHtml).toContain('278.3');
    expect(tooltipHtml).toContain('%');
  });

  it('should handle missing benchmark and group data gracefully', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland
    );
    const mockPoint = {
      x: 0,
      y: 703.420759,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: {
          custom: { areaCode: 'A1425', xCategoryKeys: mockXCategoryKeys },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).toContain('North FooBar');
  });

  it('should include the measurement unit if provided', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      undefined,
      'cases'
    );
    const mockPoint = {
      x: 0,
      y: 278.29134,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: {
          custom: { areaCode: 'A1425', xCategoryKeys: mockXCategoryKeys },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).toContain('cases');
  });

  it('shows benchmark comparison when England is benchmark and point is not England', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      BenchmarkComparisonMethod.Unknown
    );

    const mockPoint = {
      x: 0,
      y: 100,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: {
          custom: { areaCode: 'A1425', xCategoryKeys: mockXCategoryKeys },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).toContain('Not compared');
  });

  it('does NOT show benchmark comparison when England is benchmark and point IS England', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      BenchmarkComparisonMethod.Unknown
    );
    const mockPoint = {
      x: 0,
      y: 200,
      series: {
        name: 'England',
        color: '#000',
        options: {
          custom: {
            areaCode: areaCodeForEngland,
            xCategoryKeys: mockXCategoryKeys,
          },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).not.toContain('Not compared');
  });

  it('shows benchmark comparison when group is benchmark and point is a selected area', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      'A1', // group benchmark
      BenchmarkComparisonMethod.Unknown
    );
    const mockPoint = {
      x: 0,
      y: 100,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: {
          custom: { areaCode: 'A1425', xCategoryKeys: mockXCategoryKeys },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).toContain('Not compared');
  });

  it('does NOT show benchmark comparison when group is benchmark and point is NOT a selected area', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      'A1', // group benchmark
      BenchmarkComparisonMethod.Unknown
    );
    const mockPoint = {
      x: 0,
      y: 200,
      series: {
        name: 'England',
        color: '#000',
        options: {
          custom: {
            areaCode: areaCodeForEngland,
            xCategoryKeys: mockXCategoryKeys,
          },
        },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).not.toContain('Not compared');
  });
});
