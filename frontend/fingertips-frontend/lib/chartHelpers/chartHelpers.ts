import {
  Area,
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPoint,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';
import { getBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
import { GovukColours } from '../styleHelpers/colours';
import { ALL_AREAS_SELECTED } from '../areaFilterHelpers/constants';
import { getBenchmarkLabelText } from '@/components/organisms/BenchmarkLabel';
import { formatNumber } from '../numberFormatter';

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

export function determineAreaCodes(
  areasSelected?: string[],
  groupAreaSelected?: string,
  availableAreas?: Area[]
): string[] {
  if (groupAreaSelected === ALL_AREAS_SELECTED) {
    return availableAreas?.map((area) => area.code) ?? [];
  }

  if (!areasSelected || areasSelected.length === 0) {
    return [areaCodeForEngland];
  }

  return areasSelected ?? [];
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

export function seriesDataWithoutGroup(
  data: HealthDataForArea[],
  groupAreaCode?: string,
  moveEnglandLast?: boolean
) {
  const withoutGroup =
    groupAreaCode !== areaCodeForEngland
      ? data.filter((item) => item.areaCode !== groupAreaCode)
      : data;

  const sortedAreasWithoutGroup = withoutGroup.toSorted((a, b) =>
    a.areaName.localeCompare(b.areaName)
  );

  if (!moveEnglandLast) return sortedAreasWithoutGroup;

  const englandArea = sortedAreasWithoutGroup.find(
    (area) => area.areaCode === areaCodeForEngland
  );

  if (englandArea) {
    return sortedAreasWithoutGroup
      .filter((area) => area.areaCode !== areaCodeForEngland)
      .concat(englandArea);
  }
  return sortedAreasWithoutGroup;
}

export function determineHealthDataForArea(
  healthDataForAllAreas: HealthDataForArea[],
  areaToFind?: string
) {
  if (areaToFind) {
    return healthDataForAllAreas.find((data) => data.areaCode === areaToFind);
  }

  return healthDataForAllAreas[0];
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
    linkedTo: areaName,
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

export function getFirstYear(
  points: HealthDataPoint[] | undefined
): number | undefined {
  if (!points || points.length < 1) return undefined;

  const year = points.reduce(
    (previous, point) => Math.min(previous, point.year),
    points[0].year
  );
  return year;
}

export function getLatestYearForAreas(
  healthDataForAreas: HealthDataForArea[]
): number | undefined {
  const years = healthDataForAreas.map(
    (area) => getLatestYear(area.healthData) ?? 0
  );
  const mostRecentYear = Math.max(...years);
  return mostRecentYear === 0 ? undefined : mostRecentYear;
}

export function getFirstYearForAreas(
  healthDataForAreas: HealthDataForArea[]
): number | undefined {
  const years = healthDataForAreas.map(
    (area) => getFirstYear(area.healthData) ?? 0
  );
  const mostRecentYear = Math.min(...years);
  return mostRecentYear === 0 ? undefined : mostRecentYear;
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
): HealthDataForArea[] | undefined {
  const mostRecentYearForAreas = getLatestYearForAreas(healthDataForAreas);
  if (!mostRecentYearForAreas) {
    return undefined;
  }
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
  return `${outcome} ${joiningWord} ${areaName ?? 'England'}`;
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

export function createTooltipHTML(
  params: {
    areaName: string;
    period: number;
    fieldName: string | number;
    benchmarkComparisonSymbol: string;
    shouldHideComparison: boolean;
    benchmarkLabel: string;
    comparisonLabel: string;
  },
  fieldValue?: number,
  measurementUnit?: string
): string[] {
  const formattedMeasurementUnit =
    measurementUnit === '%' ? measurementUnit : ` ${measurementUnit}`;

  return [
    `<div style="padding-right: 25px">
        <span style="font-weight: bold; display: block">${params.areaName}</span>
        <span style="display: block">${params.period}</span>
        <span style="display: block">${params.fieldName}</span>
        <div style="display: flex; margin-top: 15px; align-items: center;">
          <div style="margin-right: 10px;">${params.benchmarkComparisonSymbol}</div>
          <div style="padding-right: 10px;">
            <span style="display: block">${formatNumber(fieldValue)}${measurementUnit ? formattedMeasurementUnit : ''}</span>
            ${params.shouldHideComparison || !params.benchmarkLabel ? '' : '<span style="display: block">' + params.benchmarkLabel + '</span>'}
            ${params.shouldHideComparison || !params.comparisonLabel ? '' : '<span style="display: block">persons ' + params.comparisonLabel + '</span>'}
          </div>
        </div>
      </div>`,
  ];
}
