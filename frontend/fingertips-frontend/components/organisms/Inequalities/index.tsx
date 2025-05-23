import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { InequalitiesForSingleTimePeriod } from '@/components/molecules/Inequalities/InequalitiesForSingleTimePeriod';
import { InequalitiesTrend } from '@/components/molecules/Inequalities/InequalitiesTrend';
import { SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea[];
  indicatorMetadata?: IndicatorDocument;
  searchState: SearchStateParams;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  dataSource?: string;
}

export function Inequalities({
  healthIndicatorData,
  indicatorMetadata,
  searchState,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  dataSource,
}: Readonly<InequalitiesProps>) {
  return (
    <div data-testid="inequalities-component">
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={healthIndicatorData}
        searchState={searchState}
        measurementUnit={indicatorMetadata?.unitLabel}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        dataSource={dataSource}
      />
      <InequalitiesTrend
        healthIndicatorData={healthIndicatorData}
        indicatorMetadata={indicatorMetadata}
        searchState={searchState}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        dataSource={dataSource}
      />
    </div>
  );
}
