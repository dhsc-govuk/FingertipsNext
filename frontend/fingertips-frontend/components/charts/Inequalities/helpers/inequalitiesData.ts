import {
  determineHealthDataForArea,
  seriesDataWithoutGroup,
} from '@/lib/chartHelpers/chartHelpers';
import {
  filterHealthData,
  getAreasWithInequalitiesData,
  getInequalitiesType,
  getInequalityCategories,
  getYearDataGroupedByInequalities,
  getYearsWithInequalityData,
  groupHealthDataByYear,
  healthDataFilterFunctionGeneratorForInequality,
  InequalitiesBarChartData,
  mapToInequalitiesTableData,
  sequenceSelectorForInequality,
  valueSelectorForInequality,
} from '@/components/charts/Inequalities/Inequalities/inequalitiesHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';

export const inequalitiesData = (
  searchState: SearchStateParams,
  indicatorMetaData?: IndicatorDocument,
  healthData?: IndicatorWithHealthDataForArea
) => {
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityBarChartTypeSelected]: inequalityTypeSelected,
    [SearchParams.InequalityBarChartAreaSelected]:
      inequalityBarChartAreaSelected,
  } = searchState;

  if (!healthData || !indicatorMetaData) return null;
  const { benchmarkMethod, polarity } = healthData;

  const [healthDataWithoutGroup] = findAndRemoveByAreaCode(
    healthData.areaHealthData ?? [],
    selectedGroupCode
  );

  const healthDataForArea = determineHealthDataForArea(
    healthDataWithoutGroup,
    inequalityBarChartAreaSelected
  );

  if (!healthDataForArea) return null;

  const inequalityCategories = getInequalityCategories(
    healthDataForArea,
    Number(selectedYear)
  );

  if (!inequalityCategories.length) return null;

  const type = getInequalitiesType(
    inequalityCategories,
    inequalityTypeSelected
  );

  const availableAreasWithInequalities = getAreasWithInequalitiesData(
    healthDataWithoutGroup,
    type,
    selectedYear
  );

  // If the user has made no selection of inequality type to display yet, use
  // the default inequality category
  const inequalityType = inequalityTypeSelected ?? inequalityCategories[0];

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

  if (!yearsDesc.length) return null;

  const dataPeriod = Number(selectedYear ?? yearsDesc[0]);
  const periodData = allData.find((data) => data.period === dataPeriod);

  if (!periodData) throw new Error('data does not exist for selected year');

  const barChartData: InequalitiesBarChartData = {
    areaCode: healthDataForArea.areaCode,
    areaName: healthDataForArea.areaName,
    data: periodData,
  };

  const chartTitle = `${indicatorMetaData?.indicatorName ?? ''} inequalities for ${healthDataForArea.areaName}, ${dataPeriod}`;

  return {
    barChartData,
    chartTitle,
    availableAreasWithInequalities,
    yearsDesc,
    inequalityCategories,
    type,
    inequalityType,
    benchmarkMethod,
    polarity,
  };
};
