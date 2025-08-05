import { InequalitiesDataWithHealthDataForArea } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithHealthDataForArea';
import {
  getHealthDataGroupedByPeriodAndInequalities,
  getPeriodsWithInequalityData,
  groupHealthDataByPeriod,
  healthDataFilterFunctionGeneratorForInequality,
  InequalitiesTableRowData,
  InequalitySequenceSelector,
  mapToInequalitiesTableData,
  sequenceSelectorForInequality,
  valueSelectorForInequality,
  HealthDataGroupedByPeriodAndInequalities,
  filterHealthData,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export interface InequalitiesDataWithHealthData
  extends InequalitiesDataWithHealthDataForArea {
  dataPeriod: string;
  allData: InequalitiesTableRowData[];
  periodsDesc: string[];
  sequenceSelector: InequalitySequenceSelector;
  healthDataGroupedByPeriodAndInequality: HealthDataGroupedByPeriodAndInequalities;
}

export const inequalitiesDataWithPeriods = (
  inequalitiesDataWithHealthDataForArea?: InequalitiesDataWithHealthDataForArea
): InequalitiesDataWithHealthData | undefined => {
  if (!inequalitiesDataWithHealthDataForArea) return;

  const { healthDataForArea, type, inequalityType, activePeriod } =
    inequalitiesDataWithHealthDataForArea;

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];

  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthDataForArea,
    healthData: filterHealthData(
      healthDataForArea.healthData,
      filterFunctionGenerator(inequalityType)
    ),
  };

  const healthDataByPeriod = groupHealthDataByPeriod(
    healthIndicatorDataWithoutOtherInequalities.healthData
  );

  const healthDataByPeriodAndInequalities =
    getHealthDataGroupedByPeriodAndInequalities(
      healthDataByPeriod,
      valueSelectorForInequality[type]
    );

  const sequenceSelector = sequenceSelectorForInequality[type];

  const allData = mapToInequalitiesTableData(
    healthDataByPeriodAndInequalities,
    sequenceSelector
  );

  const periodsDesc = getPeriodsWithInequalityData(allData).reverse();

  if (!periodsDesc.length) return;

  const dataPeriod = activePeriod ?? periodsDesc[0];
  return {
    ...inequalitiesDataWithHealthDataForArea,
    dataPeriod,
    allData,
    periodsDesc,
    sequenceSelector,
    healthDataGroupedByPeriodAndInequality: healthDataByPeriodAndInequalities,
  };
};
