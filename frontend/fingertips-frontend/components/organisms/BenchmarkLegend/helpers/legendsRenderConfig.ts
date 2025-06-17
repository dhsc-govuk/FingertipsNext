import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import {
  bobOutcomes,
  ragOutcomes,
} from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';

export const legendsRenderConfig = (legendsToShow: BenchmarkLegendsToShow) => {
  const { judgement: judgement95 = false, noJudgement: noJudgement95 = false } =
    legendsToShow[BenchmarkComparisonMethod.CIOverlappingReferenceValue95] ??
    {};

  const outcomes95 = [
    ...new Set([
      ...(judgement95 ? ragOutcomes : []),
      ...(noJudgement95 ? bobOutcomes : []),
    ]),
  ];

  const { judgement: judgement99 = false, noJudgement: noJudgement99 = false } =
    legendsToShow[BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8] ??
    {};

  const outcomes99 = [
    ...new Set([
      ...(judgement99 ? ragOutcomes : []),
      ...(noJudgement99 ? bobOutcomes : []),
    ]),
  ];

  const { judgement: showQ = false, noJudgement: showQnoJudgement = false } =
    legendsToShow[BenchmarkComparisonMethod.Quintiles] ?? {};

  const show95 = outcomes95.length > 0;
  const show99 = outcomes99.length > 0;
  const hideDuplicateQuintileSubheading = showQ && showQnoJudgement;

  return {
    show95,
    outcomes95,
    show99,
    outcomes99,
    showQ,
    showQnoJudgement,
    hideDuplicateQuintileSubheading,
  };
};
