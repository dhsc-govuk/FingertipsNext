import { InequalitiesDataWithHealthDataForArea } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithHealthDataForArea';
import {
  filterHealthData,
  getYearDataGroupedByInequalities,
  getYearsWithInequalityData,
  groupHealthDataByYear,
  healthDataFilterFunctionGeneratorForInequality,
  InequalitiesTableRowData,
  InequalitySequenceSelector,
  mapToInequalitiesTableData,
  sequenceSelectorForInequality,
  valueSelectorForInequality,
  YearlyHealthDataGroupedByInequalities,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export interface InequalitiesDataWithHealthData
  extends InequalitiesDataWithHealthDataForArea {
  dataPeriod: number;
  allData: InequalitiesTableRowData[];
  yearsDesc: number[];
  sequenceSelector: InequalitySequenceSelector;
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities;
}

export const inequalitiesDataWithYears = (
  inequalitiesDataWithHealthDataForArea?: InequalitiesDataWithHealthDataForArea
): InequalitiesDataWithHealthData | undefined => {
  if (!inequalitiesDataWithHealthDataForArea) return;
  const { healthDataForArea, type, inequalityType, activeYear } =
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

  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorDataWithoutOtherInequalities.healthData
  );

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(
      yearlyHealthdata,
      valueSelectorForInequality[type]
    );

  const sequenceSelector = sequenceSelectorForInequality[type];

  const allData = mapToInequalitiesTableData(
    yearlyHealthDataGroupedByInequalities,
    sequenceSelector
  );

  const yearsDesc = getYearsWithInequalityData(allData).reverse();

  if (!yearsDesc.length) return;

  const dataPeriod = Number(activeYear ?? yearsDesc[0]);
  return {
    ...inequalitiesDataWithHealthDataForArea,
    dataPeriod,
    allData,
    yearsDesc,
    sequenceSelector,
    yearlyHealthDataGroupedByInequalities,
  };
};
