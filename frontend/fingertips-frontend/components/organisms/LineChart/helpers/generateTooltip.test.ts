import { generateTooltip } from './generateTooltip';
import { mockIndicatorData } from '../mocks';
import {
  BenchmarkComparisonMethod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

describe('generateTooltip', () => {
  it('should return a Highcharts.TooltipOptions object', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      PeriodType.Calendar,
      Frequency.Annually
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
      PeriodType.Calendar,
      Frequency.Annually,
      BenchmarkComparisonMethod.Unknown,
      '%'
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

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions?.formatter?.call(mockPoint);
    expect(tooltipHtml).toContain('North FooBar');
    expect(tooltipHtml).toContain('278.3');
    expect(tooltipHtml).toContain('%');
  });

  it('should handle missing benchmark and group data gracefully', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      PeriodType.Calendar,
      Frequency.Annually
    );
    const mockPoint = {
      x: 2004,
      y: 703.420759,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: { custom: { areaCode: 'A1425' } },
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
      PeriodType.Calendar,
      Frequency.Annually,
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

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).toContain('cases');
  });

  it('shows benchmark comparison when England is benchmark and point is not England', () => {
    const tooltipOptions = generateTooltip(
      mockIndicatorData,
      areaCodeForEngland,
      PeriodType.Calendar,
      Frequency.Annually,
      BenchmarkComparisonMethod.Unknown
    );

    const mockPoint = {
      x: 2020,
      y: 100,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: { custom: { areaCode: 'A1425' } },
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
      PeriodType.Calendar,
      Frequency.Annually,
      BenchmarkComparisonMethod.Unknown
    );
    const mockPoint = {
      x: 2020,
      y: 200,
      series: {
        name: 'England',
        color: '#000',
        options: { custom: { areaCode: areaCodeForEngland } },
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
      PeriodType.Calendar,
      Frequency.Annually,
      BenchmarkComparisonMethod.Unknown
    );
    const mockPoint = {
      x: 2020,
      y: 100,
      series: {
        name: 'North FooBar',
        color: '#000',
        options: { custom: { areaCode: 'A1425' } },
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
      PeriodType.Calendar,
      Frequency.Annually,
      BenchmarkComparisonMethod.Unknown
    );
    const mockPoint = {
      x: 2020,
      y: 200,
      series: {
        name: 'England',
        color: '#000',
        options: { custom: { areaCode: areaCodeForEngland } },
      },
    };

    // @ts-expect-error not fully formed mockPoint
    const tooltipHtml = tooltipOptions.formatter.call(mockPoint);
    expect(tooltipHtml).not.toContain('Not compared');
  });
});
