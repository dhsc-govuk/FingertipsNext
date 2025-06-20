import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export const inequalitiesSelected = (
  searchState: SearchStateParams,
  chartType = ChartType.SingleTimePeriod
) => {
  const {
    [SearchParams.InequalityBarChartTypeSelected]:
      inequalityBarChartTypeSelected,
    [SearchParams.InequalityBarChartAreaSelected]:
      inequalityBarChartAreaSelected,
    [SearchParams.InequalityLineChartTypeSelected]:
      inequalityLineChartTypeSelected,
    [SearchParams.InequalityLineChartAreaSelected]:
      inequalityLineChartAreaSelected,
  } = searchState;

  if (chartType === ChartType.Trend) {
    return {
      inequalityTypeSelected: inequalityLineChartTypeSelected,
      inequalityAreaSelected: inequalityLineChartAreaSelected,
    };
  }

  return {
    inequalityTypeSelected: inequalityBarChartTypeSelected,
    inequalityAreaSelected: inequalityBarChartAreaSelected,
  };
};
