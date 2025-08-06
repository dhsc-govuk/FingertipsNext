import { SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesDataBasicInfo } from '@/components/charts/Inequalities/helpers/inequalitiesDataBasicInfo';
import { inequalitiesDataWithAreas } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithAreas';
import { inequalitiesDataWithHealthDataForArea } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithHealthDataForArea';
import { inequalitiesDataWithPeriods } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithPeriods';
import { inequalitiesDataWithBarChart } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithBarChart';
import { inequalitiesDataWithLineChart } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithLineChart';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

export const inequalitiesData = (
  searchState: SearchStateParams,
  indicatorMetaData?: IndicatorDocument,
  healthData?: IndicatorWithHealthDataForArea,
  chartType = ChartType.SingleTimePeriod
) => {
  const basicInfo = inequalitiesDataBasicInfo(
    searchState,
    healthData,
    chartType,
    indicatorMetaData
  );

  const withAreaData = inequalitiesDataWithAreas(basicInfo);

  const withHealthData = inequalitiesDataWithHealthDataForArea(withAreaData);

  const withPeriods = inequalitiesDataWithPeriods(withHealthData);

  const withBarChart = inequalitiesDataWithBarChart(withPeriods);

  const withLineChart = inequalitiesDataWithLineChart(withBarChart);
  if (!withLineChart) return;

  const {
    barChartData,
    lineChartData,
    inequalitiesLineChartOptions,
    chartTitle,
    availableAreasWithInequalities,
    periodsDesc,
    inequalityCategories,
    type,
    inequalityType,
    benchmarkMethod,
    polarity,
    orderedDynamicKeys,
  } = withLineChart;

  return {
    barChartData,
    lineChartData,
    inequalitiesLineChartOptions,
    chartTitle,
    availableAreasWithInequalities,
    periodsDesc,
    inequalityCategories,
    type,
    inequalityType,
    benchmarkMethod,
    polarity,
    orderedDynamicKeys,
  };
};
