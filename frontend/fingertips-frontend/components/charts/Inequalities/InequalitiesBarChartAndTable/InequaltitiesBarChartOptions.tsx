import { TimePeriodDropDown } from '@/components/molecules/TimePeriodDropDown';
import { InequalitiesTypesDropDown } from '@/components/charts/Inequalities/InequalitiesTypesDropDown';
import { SearchParams } from '@/lib/searchStateManager';
import { ChartSelectArea } from '@/components/molecules/ChartSelectArea';
import { inequalityDatePeriodOptions } from '@/components/charts/Inequalities/helpers/inequalityDatePeriodOptions';
import { inequalityTypeOptions } from '@/components/charts/Inequalities/helpers/inequalityTypeOptions';
import { inequalityAreaOptions } from '@/components/charts/Inequalities/helpers/inequalityAreaOptions';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useInequalitiesData } from '@/components/charts/Inequalities/hooks/useInequalitiesData';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export function InequalitiesBarChartOptions() {
  const data = useInequalitiesData(ChartType.SingleTimePeriod, true);
  const searchParams = useSearchStateParams();
  console.log({ InequalitiesBarChartOptions: data });
  if (!data) return null;

  const { healthData } = data;

  const {
    [SearchParams.InequalityBarChartTypeSelected]: inequalityTypeSelected = '',
  } = searchParams;

  const inequalityTypes = inequalityTypeOptions(healthData);
  const selectedType = inequalityTypes.includes(inequalityTypeSelected)
    ? inequalityTypeSelected
    : inequalityTypes.at(0);

  const uniquePeriodLabels = inequalityDatePeriodOptions(
    healthData,
    selectedType
  );
  const availableAreasWithInequalities = inequalityAreaOptions(healthData);

  return (
    <>
      <TimePeriodDropDown years={uniquePeriodLabels} />
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityTypes}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityBarChartTypeSelected
        }
        testRef="bc"
      />
      <ChartSelectArea
        availableAreas={availableAreasWithInequalities}
        chartAreaSelectedKey={SearchParams.InequalityBarChartAreaSelected}
      />
    </>
  );
}
