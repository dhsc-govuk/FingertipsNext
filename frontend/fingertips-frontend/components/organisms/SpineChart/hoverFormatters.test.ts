import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatBarHover, formatSymbolHover } from './hoverFormatters';

describe('hoverFormatters', () => {
  describe('formatBarHover', () => {
    it('should format bar hover content correctly', () => {
      const props = {
        period: 2025,
        lowerName: 'Lower Area',
        lowerValue: 10.7,
        upperName: 'Upper Area',
        upperValue: 20,
        units: '%',
        colour: '#ff0000',
        indicatorName: 'Test Indicator',
      };

      const result = formatBarHover(props);

      expect(result).toContain('Benchmark: England');
      expect(result).toContain('2025');
      expect(result).toContain('Test Indicator');
      expect(result).toContain('10.7% to 20.0%');
      expect(result).toContain('Lower Area to Upper Area');
      expect(result).toContain('color:#ff0000; font-size:19px;');
    });
  });

  describe('formatSymbolHover', () => {
    it('should format symbol hover content correctly when outcome is "Not compared"', () => {
      const props = {
        title: 'Test Title',
        period: 2025,
        benchmarkComparisonMethod:
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        value: 15.8,
        units: '%',
        outcome: 'Not compared',
        colour: '#00ff00',
        shape: SymbolsEnum.Circle,
        indicatorName: 'Test Indicator',
      };

      const result = formatSymbolHover(props);

      expect(result).toContain('Test Title');
      expect(result).toContain('2025');
      expect(result).toContain('Test Indicator');
      expect(result).toContain('15.8%');
      expect(result).toContain('Not compared');
      expect(result).toContain('color:#00ff00; font-size:19px;');
    });

    it('should format symbol hover content correctly when outcome is compared', () => {
      const props = {
        title: 'Test Title',
        period: 2025,
        benchmarkComparisonMethod:
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        value: 15,
        units: '%',
        outcome: 'Better',
        colour: '#0000ff',
        shape: SymbolsEnum.Triangle,
        indicatorName: 'Test Indicator',
      };

      const result = formatSymbolHover(props);

      expect(result).toContain('Test Title');
      expect(result).toContain('2025');
      expect(result).toContain('Test Indicator');
      expect(result).toContain('15.0%');
      expect(result).toContain('Better than England');
      expect(result).toContain('(95%)');
      expect(result).toContain('color:#0000ff; font-size:19px;');
    });

    it('should not render the outcome if not provided', () => {
      const props = {
        title: 'Test Title',
        period: 2025,
        benchmarkComparisonMethod:
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        value: 15,
        units: '%',
        colour: '#0000ff',
        shape: SymbolsEnum.Triangle,
        indicatorName: 'Test Indicator',
      };

      const result = formatSymbolHover(props);

      expect(result).toContain('Test Title');
      expect(result).toContain('2025');
      expect(result).toContain('Test Indicator');
      expect(result).toContain('15.0%');
      expect(result).not.toContain('Better than England');
      expect(result).not.toContain('Not compared');
    });
  });
});
