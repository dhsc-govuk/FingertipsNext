import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  Frequency,
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
  selectedPeriod?: string;
  selectedGroupCode?: string;
  inequalityLineChartAreaSelected?: string;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  chartType: ChartType;
  activePeriod?: string;
  indicatorMetaData: IndicatorDocument;
  areasSelected: string[];
  frequency?: Frequency;
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
    frequency,
  } = healthData;

  const { inequalityTypeSelected, inequalityAreaSelected } =
    inequalitiesSelected(searchState, chartType);

  const activePeriod =
    chartType === ChartType.SingleTimePeriod ? selectedYear : undefined;

  return {
    areaHealthData,
    inequalityTypeSelected,
    inequalityAreaSelected,
    inequalityLineChartAreaSelected,
    selectedGroupCode,
    selectedPeriod: selectedYear,
    benchmarkMethod,
    polarity,
    chartType,
    activePeriod,
    indicatorMetaData,
    areasSelected: determineAreaCodes(areasSelected),
    frequency,
  };
};
