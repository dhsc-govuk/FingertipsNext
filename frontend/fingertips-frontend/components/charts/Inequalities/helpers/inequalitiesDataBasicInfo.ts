import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesSelected } from '@/components/charts/Inequalities/helpers/inequalitiesSelected';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';

export interface InequalitiesDataBasicInfo {
  areaHealthData: HealthDataForArea[];
  inequalityTypeSelected?: string;
  inequalityAreaSelected?: string;
  selectedYear?: string;
  selectedGroupCode?: string;
  inequalityLineChartAreaSelected?: string;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  chartType: ChartType;
  activeYear?: string;
  indicatorMetaData: IndicatorDocument;
  areasSelected: string[];
}

export const inequalitiesDataBasicInfo = (
  searchState: SearchStateParams,
  healthData?: IndicatorWithHealthDataForArea,
  chartType = ChartType.SingleTimePeriod,
  indicatorMetaData?: IndicatorDocument
): InequalitiesDataBasicInfo | undefined => {
  if (!healthData || !indicatorMetaData) return;

  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityLineChartAreaSelected]:
      inequalityLineChartAreaSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = searchState;

  const {
    benchmarkMethod = BenchmarkComparisonMethod.Unknown,
    polarity = IndicatorPolarity.Unknown,
    areaHealthData = [],
  } = healthData;

  const { inequalityTypeSelected, inequalityAreaSelected } =
    inequalitiesSelected(searchState, chartType);

  const activeYear =
    chartType === ChartType.SingleTimePeriod ? selectedYear : undefined;

  return {
    areaHealthData,
    inequalityTypeSelected,
    inequalityAreaSelected,
    inequalityLineChartAreaSelected,
    selectedGroupCode,
    selectedYear,
    benchmarkMethod,
    polarity,
    chartType,
    activeYear,
    indicatorMetaData,
    areasSelected: determineAreaCodes(areasSelected),
  };
};
