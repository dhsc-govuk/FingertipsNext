import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatBarHover, formatSymbolHover } from './hoverFormatters';
import { englandAreaString } from '@/lib/chartHelpers/constants';

describe('hoverFormatters', () => {
  describe('formatBarHover', () => {
    it('should format bar hover content correctly', () => {
      const result = formatBarHover({
        period: 2025,
        lowerName: 'Lower Area',
        lowerValue: 10.7,
        upperName: 'Upper Area',
        upperValue: 20,
        units: '%',
        colour: '#ff0000',
        indicatorName: 'Test Indicator',
        benchmarkName: englandAreaString,
      });

      expect(result).toContain('Benchmark: England');
      expect(result).toContain('2025');
      expect(result).toContain('Test Indicator');
      expect(result).toContain('10.7% to 20.0%');
      expect(result).toContain('Lower Area to Upper Area');
      expect(result).toContain('color:#ff0000; font-size:30px;');
    });
  });

  describe('formatSymbolHover', () => {
    const mockProps = {
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
      benchmarkName: englandAreaString,
    };

    it('should format symbol hover content correctly when outcome is "Not compared"', () => {
      const props = {
        ...mockProps,
        outcome: 'Not compared',
      };

      const result = formatSymbolHover(props);

      expect(result).toContain('Not compared');
    });

    it('should not apply text-shadow when shape is PlotLine', () => {
      const props = {
        ...mockProps,
        shape: SymbolsEnum.PlotLine,
      };

      const result = formatSymbolHover(props);

      expect(result).not.toContain('text-shadow');
    });

    it('should format symbol hover content correctly when outcome is compared', () => {
      const props = {
        ...mockProps,
        outcome: 'Better',
      };

      const result = formatSymbolHover(props);

      expect(result).toContain('Better than England');
      expect(result).toContain('(95%)');
    });

    it('should render the outcome if provided', () => {
      const props = {
        ...mockProps,
        outcome: BenchmarkOutcome.Similar,
      };

      const result = formatSymbolHover(props);

      expect(result).toContain('Similar to England');
    });
  });
});
