import {
  getMethodsAndOutcomes,
  IndicatorBenchmarkSummary,
} from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

const testRow95judged: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
  quartileData: { polarity: IndicatorPolarity.LowIsGood },
};

const testRow95nonJudged: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
};

const testRow99judged: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
  quartileData: { polarity: IndicatorPolarity.LowIsGood },
};

const testRow99nonJudged: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
  quartileData: { polarity: IndicatorPolarity.NoJudgement },
};

const testRowQuintilesJudged: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod: BenchmarkComparisonMethod.Quintiles,
  quartileData: { polarity: IndicatorPolarity.LowIsGood },
};

const testRowQuintilesNonJudged: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod: BenchmarkComparisonMethod.Quintiles,
  quartileData: { polarity: IndicatorPolarity.NoJudgement },
};

const testRowWithoutQuartileData: IndicatorBenchmarkSummary = {
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
  polarity: IndicatorPolarity.NoJudgement,
};

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

  describe('without quartileData', () => {
    it('should work fine without quartile data', () => {
      const result = getMethodsAndOutcomes([testRowWithoutQuartileData]);
      expect(result).toEqual(expectedResult(['noJudgement95']));
    });
  });
});
