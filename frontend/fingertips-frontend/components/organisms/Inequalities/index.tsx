import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateParams } from '@/lib/searchStateManager';
import { InequalitiesForSingleTimePeriod } from '@/components/molecules/Inequalities/InequalitiesForSingleTimePeriod';
import { InequalitiesTrend } from '@/components/molecules/Inequalities/InequalitiesTrend';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  measurementUnit?: string;
}

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
  searchState,
}: Readonly<InequalitiesProps>) {
  return (
    <div data-testid="inequalities-component">
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={healthIndicatorData}
        searchState={searchState}
        measurementUnit={measurementUnit}
      />
      <br />
      <InequalitiesTrend
        healthIndicatorData={healthIndicatorData}
        searchState={searchState}
        measurementUnit={measurementUnit}
      />
    </div>
  );
}
