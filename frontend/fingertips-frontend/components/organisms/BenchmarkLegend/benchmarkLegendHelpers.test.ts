import { SpineChartTableRowProps } from '@/components/organisms/SpineChartTable';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

const testRow95judged = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
  benchmarkStatistics: { polarity: IndicatorPolarity.LowIsGood },
} as SpineChartTableRowProps;

const testRow95nonJudged = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
} as SpineChartTableRowProps;

const testRow99judged = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
  benchmarkStatistics: { polarity: IndicatorPolarity.LowIsGood },
} as SpineChartTableRowProps;

const testRow99nonJudged = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
  benchmarkStatistics: { polarity: IndicatorPolarity.NoJudgement },
} as SpineChartTableRowProps;

const testRowQuintilesJudged = {
  benchmarkComparisonMethod: BenchmarkComparisonMethod.Quintiles,
  benchmarkStatistics: { polarity: IndicatorPolarity.LowIsGood },
} as SpineChartTableRowProps;

const testRowQuintilesNonJudged = {
  benchmarkComparisonMethod: BenchmarkComparisonMethod.Quintiles,
  benchmarkStatistics: { polarity: IndicatorPolarity.NoJudgement },
} as SpineChartTableRowProps;

const expectedResult = (areTrue: string[]) => ({
  CIOverlappingReferenceValue95: {
    judgement: areTrue.includes('judgement95'),
    noJudgement: areTrue.includes('noJudgement95'),
  },
  CIOverlappingReferenceValue99_8: {
    judgement: areTrue.includes('judgement99'),
    noJudgement: areTrue.includes('noJudgement99'),
  },
  Quintiles: {
    judgement: areTrue.includes('judgementQuintiles'),
    noJudgement: areTrue.includes('noJudgementQuintiles'),
  },
});

describe('BenchmarkLegendHelpers', () => {
  describe('Single options', () => {
    it('should show only CI95 judgement', () => {
      const result = getMethodsAndOutcomes([testRow95judged]);
      expect(result).toEqual(expectedResult(['judgement95']));
    });

    it('should show only CI95 no judgement', () => {
      const result = getMethodsAndOutcomes([testRow95nonJudged]);
      expect(result).toEqual(expectedResult(['noJudgement95']));
    });

    it('should show only CI99.8 judgement', () => {
      const result = getMethodsAndOutcomes([testRow99judged]);
      expect(result).toEqual(expectedResult(['judgement99']));
    });

    it('should show only CI99.8 no judgement', () => {
      const result = getMethodsAndOutcomes([testRow99nonJudged]);
      expect(result).toEqual(expectedResult(['noJudgement99']));
    });

    it('should show only Quintiles judgement', () => {
      const result = getMethodsAndOutcomes([testRowQuintilesJudged]);
      expect(result).toEqual(expectedResult(['judgementQuintiles']));
    });

    it('should show only Quintiles no judgement', () => {
      const result = getMethodsAndOutcomes([testRowQuintilesNonJudged]);
      expect(result).toEqual(expectedResult(['noJudgementQuintiles']));
    });
  });

  describe('handling judgement and non judgement in the same method', () => {
    it('should handle multiple 95s', () => {
      const result = getMethodsAndOutcomes([
        testRow95judged,
        testRow95nonJudged,
      ]);
      expect(result).toEqual(expectedResult(['judgement95', 'noJudgement95']));
    });

    it('should handle multiple 99s', () => {
      const result = getMethodsAndOutcomes([
        testRow99judged,
        testRow99nonJudged,
      ]);
      expect(result).toEqual(expectedResult(['judgement99', 'noJudgement99']));
    });

    it('should handle multiple Quintiles', () => {
      const result = getMethodsAndOutcomes([
        testRowQuintilesJudged,
        testRowQuintilesNonJudged,
      ]);
      expect(result).toEqual(
        expectedResult(['judgementQuintiles', 'noJudgementQuintiles'])
      );
    });
  });

  describe('multiples from different methods', () => {
    it('should handle different methods and polarities', () => {
      const result = getMethodsAndOutcomes([
        testRow95judged,
        testRow99nonJudged,
        testRowQuintilesJudged,
      ]);
      expect(result).toEqual(
        expectedResult(['judgement95', 'noJudgement99', 'judgementQuintiles'])
      );
    });

    it('should handle multiple instances of the same method/polarity combinations', () => {
      const result = getMethodsAndOutcomes([
        testRow95judged,
        testRow95judged,
        testRow95judged,
        testRow95judged,
        testRow99nonJudged,
        testRow99nonJudged,
        testRow99nonJudged,
      ]);
      expect(result).toEqual(expectedResult(['judgement95', 'noJudgement99']));
    });
  });
});
