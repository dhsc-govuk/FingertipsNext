import { InequalitiesChartData } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';

export const benchmarkOutcomeForYear = (
  year: number,
  inequality: string,
  chartData: InequalitiesChartData
) => {
  const matchingRow = chartData.rowData.find(
    (point) => point.period === Number(year)
  );
  return (
    matchingRow?.inequalities[inequality]?.benchmarkComparison?.outcome ??
    BenchmarkOutcome.NotCompared
  );
};
