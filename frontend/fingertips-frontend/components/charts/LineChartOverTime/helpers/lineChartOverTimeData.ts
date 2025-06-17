import {
  determineAreaCodes,
  determineBenchmarkToUse,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { getAllDataWithoutInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { generateStandardLineChartOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import {
  BenchmarkComparisonMethod,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const lineChartOverTimeData = (
  indicatorMetaData: IndicatorDocument,
  healthData: IndicatorWithHealthDataForArea,
  areasSelected: string[],
  selectedGroupCode?: string,
  benchmarkAreaSelected?: string
) => {
  const areaCodes = determineAreaCodes(areasSelected);
  const benchmarkComparisonMethod = healthData?.benchmarkMethod;
  const polarity = healthData?.polarity;

  const healthIndicatorData = healthData?.areaHealthData ?? [];
  const dataWithoutEnglandOrGroup = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );

  const englandIndicatorData = healthIndicatorData.find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode !== areaCodeForEngland
      ? healthIndicatorData.find(
          (areaData) => areaData.areaCode === selectedGroupCode
        )
      : undefined;

  const {
    areaDataWithoutInequalities,
    englandDataWithoutInequalities,
    groupDataWithoutInequalities,
  } = getAllDataWithoutInequalities(
    dataWithoutEnglandOrGroup,
    { englandIndicatorData, groupData },
    areaCodes
  );

  const shouldLineChartBeShownForOneArea =
    areaDataWithoutInequalities[0]?.healthData.length > 1 ||
    (englandDataWithoutInequalities &&
      englandDataWithoutInequalities.healthData.length > 1);

  const shouldLineChartBeShownForTwoAreas =
    (dataWithoutEnglandOrGroup[0]?.healthData.length > 1 ||
      benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles) &&
    areasSelected.length === 2;

  if (!shouldLineChartBeShownForOneArea && !shouldLineChartBeShownForTwoAreas)
    return null;

  const yAxisTitle = indicatorMetaData?.unitLabel
    ? `Value: ${indicatorMetaData?.unitLabel}`
    : undefined;

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const chartOptions = generateStandardLineChartOptions(
    areaDataWithoutInequalities,
    true,
    benchmarkToUse,
    {
      indicatorName: indicatorMetaData?.indicatorName,
      englandData: englandDataWithoutInequalities,
      benchmarkComparisonMethod: benchmarkComparisonMethod,
      groupIndicatorData: groupDataWithoutInequalities,
      yAxisTitle,
      xAxisTitle: 'Period',
      measurementUnit: indicatorMetaData?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
    }
  );

  return {
    chartOptions,
    areaDataWithoutInequalities,
    englandDataWithoutInequalities,
    groupDataWithoutInequalities,
    indicatorMetaData,
    polarity,
    benchmarkComparisonMethod,
    benchmarkToUse,
  };
};
