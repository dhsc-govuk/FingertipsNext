import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPoint,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';
import { getBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
import { GovukColours } from '../styleHelpers/colours';
import { getBenchmarkLabelText } from '@/components/organisms/BenchmarkLabel';

export const AXIS_TITLE_FONT_SIZE = 19;
export const AXIS_LABEL_FONT_SIZE = 16;

export enum AreaTypeLabelEnum {
  Benchmark = 'Benchmark',
  Group = 'Group',
  Area = 'Area',
}

export function sortHealthDataForAreasByDate(
  data: HealthDataForArea[]
): HealthDataForArea[] {
  return data.map((area) => sortHealthDataForAreaByDate(area));
}

export function sortHealthDataForAreaByDate(
  data: HealthDataForArea
): HealthDataForArea {
  return {
    ...data,
    healthData: data.healthData.toSorted((a, b) => a.year - b.year),
  };
}

export function sortHealthDataByYearDescending(
  data: HealthDataForArea[] = []
): HealthDataForArea[] {
  return data.map((item) => ({
    ...item,
    healthData: sortHealthDataPointsByDescendingYear(item.healthData),
  }));
}

export function sortHealthDataPointsByDescendingYear(
  data: HealthDataPoint[] | undefined
): HealthDataPoint[] {
  if (!data) {
    return [];
  }
  return data.toSorted((a, b) => b.year - a.year);
}

export function seriesDataForIndicatorIndexAndArea(
  data: HealthDataForArea[][],
  indicatorIndex: number,
  seriesAreaCode: string
) {
  return data[indicatorIndex].find(
    (areaData) => areaData.areaCode === seriesAreaCode
  );
}

export function seriesDataWithoutEnglandOrGroup(
  data: HealthDataForArea[],
  groupAreaCode?: string
) {
  return data.filter(
    (item) =>
      item.areaCode !== areaCodeForEngland && item.areaCode !== groupAreaCode
  );
}

export function getHealthDataWithoutInequalities(
  data: HealthDataForArea
): HealthDataPoint[] {
  return data?.healthData?.filter((data) => data.isAggregate);
}

export function isEnglandSoleSelectedArea(areasSelected?: string[]) {
  const distinctAreas = [...new Set(areasSelected)];
  return distinctAreas.length === 1 && distinctAreas[0] === areaCodeForEngland;
}

export function getMostRecentData(
  data: HealthDataPoint[]
): HealthDataPoint | undefined {
  return data.length > 0 ? data[0] : undefined;
}

export async function loadHighchartsModules(callback: () => void) {
  await import('highcharts/highcharts-more').then(callback);
}

export const getBenchmarkColour = (
  method: BenchmarkComparisonMethod,
  outcome: BenchmarkOutcome,
  polarity: IndicatorPolarity
) => {
  const colours = getBenchmarkTagStyle(method, outcome, polarity);
  const backgroundColor = colours?.backgroundColor;
  return backgroundColor === 'transparent' ? undefined : backgroundColor;
};

export function generateConfidenceIntervalSeries(
  areaName: string | undefined,
  data: (number | undefined)[][],
  showConfidenceIntervalsData?: boolean,
  optionalParams?: {
    color?: GovukColours;
    whiskerLength?: string;
    lineWidth?: number;
  }
): Highcharts.SeriesOptionsType {
  return {
    type: 'errorbar',
    name: areaName,
    data: data,
    visible: showConfidenceIntervalsData,
    color: optionalParams?.color ?? GovukColours.MidGrey,
    whiskerLength: optionalParams?.whiskerLength ?? '20%',
    lineWidth: optionalParams?.lineWidth ?? 2,
  };
}

export function getLatestYear(
  points: HealthDataPoint[] | undefined
): number | undefined {
  if (!points || points.length < 1) return undefined;

  const year = points.reduce((previous, point) => {
    return Math.max(previous, point.year);
  }, points[0].year);
  return year;
}

function getMostRecentYearForAreas(
  healthDataForAreas: HealthDataForArea[]
): number {
  return healthDataForAreas.reduce((previous, area) => {
    return Math.max(previous, getLatestYear(area?.healthData) ?? 0);
  }, healthDataForAreas[0].healthData[0].year);
}

function getAreasIndicatorDataForYear(
  healthDataForAreas: HealthDataForArea[],
  year: number
): HealthDataForArea[] {
  return healthDataForAreas.map((healthDataForArea) =>
    getAreaIndicatorDataForYear(healthDataForArea, year)
  );
}

export function getAreaIndicatorDataForYear(
  healthDataForArea: HealthDataForArea,
  year: number
): HealthDataForArea {
  const dataPointForMostRecentYear = healthDataForArea.healthData.find(
    (healthDataPoint) => healthDataPoint.year === year
  );

  return {
    ...healthDataForArea,
    healthData: dataPointForMostRecentYear
      ? [{ ...dataPointForMostRecentYear }]
      : [],
  };
}

export function getIndicatorDataForAreasForMostRecentYearOnly(
  healthDataForAreas: HealthDataForArea[]
): HealthDataForArea[] {
  const mostRecentYearForAreas = getMostRecentYearForAreas(healthDataForAreas);
  return getAreasIndicatorDataForYear(
    healthDataForAreas,
    mostRecentYearForAreas
  );
}

export const getConfidenceLimitNumber = (
  benchmarkComparisonMethod: BenchmarkComparisonMethod
): number => {
  switch (benchmarkComparisonMethod) {
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8:
      return 99.8;
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue95:
      return 95;
    default:
      return 0;
  }
};

const getCategory = (
  benchmarkOutcome: BenchmarkOutcome,
  label: string
): string => {
  switch (true) {
    case label === AreaTypeLabelEnum.Benchmark && !!benchmarkOutcome:
      return 'Benchmark: ';
    case label === AreaTypeLabelEnum.Group:
      return 'Group: ';
    default:
      return '';
  }
};

const getComparisonLabelText = (
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  benchmarkOutcome: BenchmarkOutcome
) => {
  if (
    !benchmarkOutcome ||
    benchmarkOutcome === BenchmarkOutcome.NotCompared ||
    benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles
  )
    return '';
  const comparison = getConfidenceLimitNumber(benchmarkComparisonMethod);
  return `(${comparison}%)`;
};

const getBenchmarkLabel = (
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  benchmarkOutcome?: BenchmarkOutcome,
  areaName?: string
) => {
  if (!benchmarkOutcome || benchmarkOutcome === BenchmarkOutcome.NotCompared)
    return 'Not compared';

  if (benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles)
    return `${benchmarkOutcome} quintile`;

  const joiningWord =
    benchmarkOutcome === BenchmarkOutcome.Similar ? 'to' : 'than';
  const outcome = getBenchmarkLabelText(benchmarkOutcome);
  return `${outcome} ${joiningWord} ${areaName ? areaName : 'England'}`;
};

export const getTooltipContent = (
  benchmarkOutcome: BenchmarkOutcome,
  label: string,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  areaName?: string
) => {
  const category = getCategory(benchmarkOutcome, label);

  if (
    label === AreaTypeLabelEnum.Benchmark ||
    label === AreaTypeLabelEnum.Group
  ) {
    return { category, benchmarkLabel: '', comparisonLabel: '' };
  }

  return {
    category,
    benchmarkLabel: getBenchmarkLabel(
      benchmarkComparisonMethod,
      benchmarkOutcome,
      areaName
    ),
    comparisonLabel: getComparisonLabelText(
      benchmarkComparisonMethod,
      benchmarkOutcome
    ),
  };
};
