import {
  BenchmarkComparisonMethod,
  DatePeriod,
  Frequency,
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { segmentCombinations } from '@/lib/healthDataHelpers/segmentCombinations';
import { findHealthDataForArea } from '@/lib/healthDataHelpers/findHealthDataForArea';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { segmentIdFromInfo } from '@/lib/healthDataHelpers/segmentIdFromInfo';
import { searchFromSegmentInfo } from '@/lib/healthDataHelpers/searchFromSegmentInfo';
import { findHealthDataForAreas } from '@/lib/healthDataHelpers/findHealthDataForAreas';
import { findQuartileBySegmentation } from '@/lib/healthDataHelpers/findQuartileBySegmentation';
import { indicatorsSorted } from '@/lib/healthDataHelpers/indicatorsSorted';
import { DatePeriodWithFrequency } from '@/lib/timePeriodHelpers/timePeriod.types';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { isSmallestReportingPeriod } from '@/lib/healthDataHelpers/isSmallestReportingPeriod';

export const spineChartIndicatorTitleColumnMinWidth = 240;

export interface SpineChartIndicatorData {
  rowId: string;
  indicatorId: number;
  indicatorName: string;
  latestDataPeriod?: DatePeriod;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  valueUnit: string;
  areasHealthData: HealthDataForArea[];
  groupData?: HealthDataForArea;
  englandData?: HealthDataForArea;
  quartileData: QuartileData;
  isSmallestReportingPeriod: boolean;
}

const onlyMatchingDataPoints = (
  areaHealthData?: HealthDataForArea,
  datePeriod?: DatePeriodWithFrequency
) => {
  if (!areaHealthData) return undefined;
  return {
    ...areaHealthData,
    healthData: areaHealthData.healthData.filter(
      (dataPoint) =>
        dataPoint.datePeriod?.to.getTime() === datePeriod?.to.getTime()
    ),
  };
};

export const buildSpineChartIndicatorData = (
  allIndicatorData: IndicatorWithHealthDataForArea[],
  allIndicatorMetadata: IndicatorDocument[],
  quartileData: QuartileData[],
  areasSelected: string[],
  searchState: SearchStateParams
): SpineChartIndicatorData[] => {
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.SegmentationReportingPeriod]: selectedReportingPeriod,
  } = searchState;

  if (!selectedGroupCode) return [];

  // indicators with names and ids
  const indicators = allIndicatorData.filter(
    (indicator) => indicator.indicatorId && indicator.name
  );

  const indicatorsInOrder = indicatorsSorted(indicators);

  // split into segments
  const segmented = indicatorsInOrder.flatMap((indicator) => {
    const indicatorId = indicator.indicatorId as number;
    const name = indicator.name as string;
    const { benchmarkMethod } = indicator;

    const metaData = allIndicatorMetadata.find(
      (meta) => Number(meta.indicatorID) === indicatorId
    );

    const segValues = segmentValues(indicator);
    const combinations = segmentCombinations(segValues);

    return combinations.map((segmentInfo) => {
      const search = searchFromSegmentInfo(segmentInfo);
      const extractedSegment = flattenSegment(indicator, search);
      const { reportingPeriod } = segmentValues(indicator);
      const frequency = indicator.frequency ?? Frequency.Annually;

      const isSmallestReportingPeriodFlag = isSmallestReportingPeriod(
        selectedReportingPeriod,
        reportingPeriod,
        frequency
      );

      const segmentId = segmentIdFromInfo(indicatorId, segmentInfo);

      const matchedQuartileData = findQuartileBySegmentation(
        quartileData,
        indicatorId,
        segmentInfo
      );

      const datePeriod = matchedQuartileData?.datePeriod;

      if (!matchedQuartileData || !datePeriod) return;
      const latestDataPeriod: DatePeriodWithFrequency = {
        ...datePeriod,
        frequency: matchedQuartileData.frequency ?? Frequency.Annually,
      };

      const areasHealthData = findHealthDataForAreas(
        extractedSegment,
        areasSelected
      )
        .map((areaHealthData) =>
          onlyMatchingDataPoints(areaHealthData, latestDataPeriod)
        )
        .filter(filterDefined) as HealthDataForArea[];

      const groupData = onlyMatchingDataPoints(
        findHealthDataForArea(extractedSegment, selectedGroupCode),
        latestDataPeriod
      );

      const englandData = onlyMatchingDataPoints(
        findHealthDataForArea(extractedSegment, areaCodeForEngland),
        latestDataPeriod
      );

      const result: SpineChartIndicatorData = {
        rowId: segmentId,
        indicatorId,
        indicatorName: extractedSegment.name ?? name,
        valueUnit: metaData?.unitLabel ?? '',
        benchmarkComparisonMethod: benchmarkMethod,
        latestDataPeriod,
        areasHealthData,
        groupData,
        englandData,
        quartileData: matchedQuartileData,
        isSmallestReportingPeriod: isSmallestReportingPeriodFlag,
      };
      return result;
    });
  });

  // return without any undefined rows
  return segmented.filter(filterDefined) as SpineChartIndicatorData[];
};
