import { InequalitiesDataWithAreas } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithAreas';
import {
  getAreasWithInequalitiesData,
  getInequalitiesType,
  getInequalityCategories,
  InequalitiesTypes,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { AreaWithoutAreaType } from '@/lib/common-types';

export interface InequalitiesDataWithHealthDataForArea
  extends InequalitiesDataWithAreas {
  availableAreasWithInequalities: AreaWithoutAreaType[];
  inequalityCategories: string[];
  type: InequalitiesTypes;
  inequalityType: string;
}

export const inequalitiesDataWithHealthDataForArea = (
  inequalitiesDataWithAreas?: InequalitiesDataWithAreas
): InequalitiesDataWithHealthDataForArea | undefined => {
  if (!inequalitiesDataWithAreas) return;

  const {
    activePeriod,
    chartType,
    healthDataForArea,
    areaHealthData,
    inequalityTypeSelected,
  } = inequalitiesDataWithAreas;

  const inequalityCategories = getInequalityCategories(
    healthDataForArea,
    activePeriod,
    chartType
  );

  if (!inequalityCategories.length) return;

  const type = getInequalitiesType(
    inequalityCategories,
    inequalityTypeSelected
  );

  const availableAreasWithInequalities = getAreasWithInequalitiesData(
    areaHealthData,
    type,
    activePeriod
  );

  // If the user has made no selection of inequality type to display yet, use
  // the default inequality category
  const inequalityType = inequalityTypeSelected ?? inequalityCategories[0];

  return {
    ...inequalitiesDataWithAreas,
    availableAreasWithInequalities,
    inequalityCategories,
    type,
    inequalityType,
  };
};
