import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';

import { InequalitiesTrend } from '../InequalitiesTrend';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { InequalitiesBarChartAndTable } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequalitiesBarChartAndTable';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea[];
  indicatorMetadata?: IndicatorDocument;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  dataSource?: string;
}

export function Inequalities({
  healthIndicatorData,
  indicatorMetadata,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  dataSource,
}: Readonly<InequalitiesProps>) {
  return (
    <div data-testid="inequalities-component">
      <InequalitiesBarChartAndTable />
      <InequalitiesTrend
        healthIndicatorData={healthIndicatorData}
        indicatorMetadata={indicatorMetadata}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        dataSource={dataSource}
      />
    </div>
  );
}
