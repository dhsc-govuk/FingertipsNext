import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { InequalitiesForSingleTimePeriod } from '@/components/molecules/Inequalities/InequalitiesForSingleTimePeriod';
import { InequalitiesTrend } from '@/components/molecules/Inequalities/InequalitiesTrend';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
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
      />
      <br />
      <InequalitiesTrend
        healthIndicatorData={healthIndicatorData}
        measurementUnit={measurementUnit}
      />
    </div>
  );
}
