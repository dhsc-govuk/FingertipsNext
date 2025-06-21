import {
  determineAreaCodes,
  determineHealthDataForArea,
} from '@/lib/chartHelpers/chartHelpers';
import {
  ChartType,
  filterHealthData,
  generateInequalitiesLineChartOptions,
  getAreasWithInequalitiesData,
  getDynamicKeys,
  getInequalitiesType,
  getInequalityCategories,
  getYearDataGroupedByInequalities,
  getYearsWithInequalityData,
  groupHealthDataByYear,
  healthDataFilterFunctionGeneratorForInequality,
  mapToInequalitiesTableData,
  reorderItemsArraysToEnd,
  sequenceSelectorForInequality,
  valueSelectorForInequality,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { inequalitiesBarChartData } from '@/components/charts/Inequalities/helpers/inequalitiesBarChartData';
import { inequalitiesLineChartData } from '@/components/charts/Inequalities/helpers/inequalitiesLineChartData';
import { inequalitiesLineChartTooltipForPoint } from '@/components/charts/Inequalities/helpers/inequalitiesLineChartTooltipForPoint';

export const inequalitiesData = (
  searchState: SearchStateParams,
  indicatorMetaData?: IndicatorDocument,
  healthData?: IndicatorWithHealthDataForArea,
  chartType = ChartType.SingleTimePeriod
) => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityBarChartTypeSelected]:
      inequalityBarChartTypeSelected,
    [SearchParams.InequalityBarChartAreaSelected]:
      inequalityBarChartAreaSelected,
    [SearchParams.InequalityLineChartTypeSelected]:
      inequalityLineChartTypeSelected,
    [SearchParams.InequalityLineChartAreaSelected]:
      inequalityLineChartAreaSelected,
  } = searchState;

  if (!healthData || !indicatorMetaData) return null;
  const { benchmarkMethod = BenchmarkComparisonMethod.Unknown, polarity } =
    healthData;

  const inequalityTypeSelected =
    chartType === ChartType.SingleTimePeriod
      ? inequalityBarChartTypeSelected
      : inequalityLineChartTypeSelected;

  const inequalityAreaSelected =
    chartType === ChartType.SingleTimePeriod
      ? inequalityBarChartAreaSelected
      : inequalityLineChartAreaSelected;

  const [healthDataWithoutGroup] = findAndRemoveByAreaCode(
    healthData.areaHealthData ?? [],
    selectedGroupCode
  );

  const healthDataForArea = determineHealthDataForArea(
    healthDataWithoutGroup,
    inequalityAreaSelected
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

  const barChartData =
    chartType == ChartType.SingleTimePeriod
      ? inequalitiesBarChartData(
          healthDataForArea,
          allData,
          yearsDesc,
          selectedYear
        )
      : null;

  const lineChartData =
    chartType == ChartType.Trend
      ? inequalitiesLineChartData(healthDataForArea, allData, yearsDesc)
      : null;

  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    sequenceSelector
  );

  const inequalitiesLineChartOptions = lineChartData
    ? generateInequalitiesLineChartOptions(
        lineChartData,
        dynamicKeys,
        type,
        true,
        inequalitiesLineChartTooltipForPoint(
          lineChartData,
          type,
          benchmarkMethod,
          indicatorMetaData.unitLabel
        ),
        {
          areasSelected: determineAreaCodes(areasSelected),
          yAxisTitleText: 'Value',
          xAxisTitleText: 'Period',
          measurementUnit: indicatorMetaData?.unitLabel,
          inequalityLineChartAreaSelected,
          indicatorName: indicatorMetaData?.indicatorName,
          areaName: healthDataForArea.areaName,
        }
      )
    : null;

  const chartTitle = `${indicatorMetaData?.indicatorName ?? ''} inequalities for ${healthDataForArea.areaName}, ${dataPeriod}`;

  const orderedDynamicKeys = reorderItemsArraysToEnd(dynamicKeys, ['Persons']);

  return {
    barChartData,
    lineChartData,
    inequalitiesLineChartOptions,
    chartTitle,
    availableAreasWithInequalities,
    yearsDesc,
    inequalityCategories,
    type,
    inequalityType,
    benchmarkMethod,
    polarity,
    orderedDynamicKeys,
  };
};
