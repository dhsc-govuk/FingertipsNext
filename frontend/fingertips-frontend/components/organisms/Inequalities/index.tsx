import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { InequalitiesForSingleTimePeriod } from '@/components/molecules/Inequalities/InequalitiesForSingleTimePeriod';
import { InequalitiesTrend } from '@/components/molecules/Inequalities/InequalitiesTrend';
import { SearchStateParams } from '@/lib/searchStateManager';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
  searchState,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}: Readonly<InequalitiesProps>) {
  return (
    <div data-testid="inequalities-component">
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={healthIndicatorData}
        measurementUnit={measurementUnit}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        searchState={searchState}
      />
      <br />
      <InequalitiesTrend
        healthIndicatorData={healthIndicatorData}
        measurementUnit={measurementUnit}
        searchState={searchState}
      />
    </div>
  );
}
