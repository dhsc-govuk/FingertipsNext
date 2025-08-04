import { InequalitiesBarChartAndTable } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequalitiesBarChartAndTable';
import { InequalitiesTrendChartAndTable } from '@/components/charts/Inequalities/InequalitiesTrendChartAndTable/InequalitiesTrendChartAndTable';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';
import { H3 } from 'govuk-react';
import { InequalitiesBarChartOptions } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequaltitiesBarChartOptions';
import { InequalitiesBarChart } from '@/components/charts/Inequalities/InequalitiesBarChart/InequalitiesBarChart';
import {
  InequalitiesBarChartData,
  InequalitiesTypes,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

export function Inequalities() {
  const type = InequalitiesTypes.Deprivation;
  const chartTitle = 'Inequalities';
  const barChartData: InequalitiesBarChartData = {
    areaCode: 'a1',
    areaName: 'Area One',
    data: {
      period: 1999,
      inequalities: {},
    },
  };
  const benchmarkMethod =
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
  const polarity = IndicatorPolarity.LowIsGood;
  const unitLabel = '%';

  return (
    <div data-testid="inequalities-component">
      <H3>Related inequalities data</H3>
      <InequalitiesBarChartOptions />
      <InequalitiesBarChart
        title={chartTitle}
        barChartData={barChartData}
        measurementUnit={unitLabel}
        type={type}
        yAxisLabel="Value"
        benchmarkComparisonMethod={benchmarkMethod}
        polarity={polarity}
      />
      <ArrowExpander
        openTitle="Show inequalities data"
        closeTitle="Hide inequalities data"
      >
        <InequalitiesBarChartAndTable />
        <InequalitiesTrendChartAndTable />
      </ArrowExpander>
    </div>
  );
}
