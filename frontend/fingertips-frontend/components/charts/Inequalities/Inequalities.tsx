import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';

import { InequalitiesTrend } from '@/components/charts/Inequalities/InequalitiesTrendChart/InequalitiesTrendChart';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { InequalitiesBarChartAndTable } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequalitiesBarChartAndTable';
import { InequalitiesTrendChartAndTable } from '@/components/charts/Inequalities/InequalitiesTrendChartAndTable/InequalitiesTrendChartAndTable';

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
      <InequalitiesTrendChartAndTable />
      <InequalitiesTrend
        healthIndicatorData={healthIndicatorData}
        indicatorMetadata={indicatorMetadata}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        dataSource={dataSource}
      />
    </div>
  );
}
