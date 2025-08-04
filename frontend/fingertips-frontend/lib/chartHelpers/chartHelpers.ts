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
import { AreaWithoutAreaType } from '../common-types';
import { convertDateToNumber } from '../timePeriodHelpers/getTimePeriodLabels';

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
    healthData: data.healthData.toSorted(
      (a, b) =>
        convertDateToNumber(a.datePeriod?.to) -
        convertDateToNumber(b.datePeriod?.to)
    ),
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
) {
  if (!data || data.length === 0) {
    return [];
  }
  return data.toSorted(
    (a, b) =>
      convertDateToNumber(b.datePeriod?.to) -
      convertDateToNumber(a.datePeriod?.to)
  );
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
  data: (number | undefined | null)[][],
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

  const dateAsNumber = points.reduce((previous, point) => {
    return Math.max(previous, point.year);
  }, points[0].year);
  return dateAsNumber;
}

export function getLatestPeriod(
  points: HealthDataPoint[] | undefined
): number | undefined {
  if (!points || points.length < 1) return undefined;

  const latestDateAsNumber = points.reduce(
    (previous, point) =>
      Math.max(previous, convertDateToNumber(point.datePeriod?.to)),
    convertDateToNumber(points[0].datePeriod?.to)
  );
  return latestDateAsNumber;
}

export function getFirstPeriod(
  points: HealthDataPoint[] | undefined
): number | undefined {
  if (!points || points.length < 1) return undefined;

  const firstDateAsNumber = points.reduce(
    (previous, point) =>
      Math.min(previous, convertDateToNumber(point.datePeriod?.to)),
    convertDateToNumber(points[0].datePeriod?.to)
  );
  return firstDateAsNumber;
}

export function getLatestPeriodForAreas(
  healthDataForAreas: HealthDataForArea[]
): number | undefined {
  if (!healthDataForAreas.length) {
    return undefined;
  }

  const latestPeriodForAreas = healthDataForAreas.map(
    (area) => getLatestPeriod(area.healthData) ?? 0
  );
  const mostRecentYear = Math.max(...latestPeriodForAreas);
  return mostRecentYear === 0 ? undefined : mostRecentYear;
}

export function getFirstPeriodForAreas(
  healthDataForAreas: HealthDataForArea[]
): number | undefined {
  if (!healthDataForAreas.length) {
    return undefined;
  }

  const firstPeriodForAreas = healthDataForAreas.map(
    (area) => getFirstPeriod(area.healthData) ?? 0
  );
  const mostRecentYear = Math.min(...firstPeriodForAreas);

  return mostRecentYear === 0 ? undefined : mostRecentYear;
}

function getAreasIndicatorDataForPeriod(
  healthDataForAreas: HealthDataForArea[],
  dateAsNumber: number
): HealthDataForArea[] {
  return healthDataForAreas.map((healthDataForArea) =>
    getAreaIndicatorDataForPeriod(healthDataForArea, dateAsNumber)
  );
}

export function getAreaIndicatorDataForPeriod(
  healthDataForArea: HealthDataForArea,
  dateAsNumber: number
): HealthDataForArea {
  const dataPointForMostRecentPeriod = healthDataForArea.healthData.find(
    (healthDataPoint) =>
      convertDateToNumber(healthDataPoint.datePeriod?.to) === dateAsNumber
  );

  return {
    ...healthDataForArea,
    healthData: dataPointForMostRecentPeriod
      ? [{ ...dataPointForMostRecentPeriod }]
      : [],
  };
}

export function getIndicatorDataForAreasForMostRecentPeriodOnly(
  healthDataForAreas: HealthDataForArea[]
): HealthDataForArea[] | undefined {
  const mostRecentPeriodForAreas = getLatestPeriodForAreas(healthDataForAreas);
  if (!mostRecentPeriodForAreas) {
    return undefined;
  }
  return getAreasIndicatorDataForPeriod(
    healthDataForAreas,
    mostRecentPeriodForAreas
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
  const validOutcomes = Object.values(BenchmarkOutcome);

  if (
    !benchmarkOutcome ||
    !validOutcomes.includes(benchmarkOutcome) ||
    benchmarkOutcome === BenchmarkOutcome.NotCompared ||
    benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles
  )
    return '';
  const comparison = getConfidenceLimitNumber(benchmarkComparisonMethod);
  return `(${comparison}%)`;
};

export const getBenchmarkLabel = (
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  benchmarkOutcome?: BenchmarkOutcome,
  areaName?: string
) => {
  if (!benchmarkOutcome || benchmarkOutcome === BenchmarkOutcome.NotCompared)
    return 'Not compared';

  if (benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles)
    return `${benchmarkOutcome} quintile`;

  const outcome = getBenchmarkLabelText(benchmarkOutcome);

  if (outcome === 'Not compared') {
    return outcome;
  }

  const joiningWord =
    benchmarkOutcome === BenchmarkOutcome.Similar ? 'to' : 'than';

  return `${outcome} ${joiningWord} ${areaName ?? 'England'}`;
};

export const getTooltipContent = (
  benchmarkOutcome: BenchmarkOutcome,
  label: string,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  areaName?: string,
  showComparisonLabels = true
) => {
  const category = getCategory(benchmarkOutcome, label);

  if (
    label === AreaTypeLabelEnum.Benchmark ||
    label === AreaTypeLabelEnum.Group ||
    !showComparisonLabels
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

export const getFormattedLabel = (
  axisValue: number,
  tickPositions: Highcharts.AxisTickPositionsArray | undefined
) => {
  const formattedNumber = formatNumber(axisValue);
  return tickPositions?.every((position) => position % 1 === 0)
    ? formattedNumber.replace('.0', '')
    : formattedNumber;
};

const shouldAddGroupAreaForBenchmarking = (
  areasSelected?: string[],
  selectedGroupCode?: string,
  selectedGroupArea?: string
): boolean => {
  return (
    selectedGroupCode !== areaCodeForEngland &&
    (selectedGroupArea === ALL_AREAS_SELECTED ||
      (Array.isArray(areasSelected) && areasSelected.length > 0))
  );
};

export const determineAreasForBenchmarking = (
  healthDataForAreas: HealthDataForArea[],
  selectedGroupCode?: string,
  areasSelected?: string[],
  selectedGroupArea?: string
): AreaWithoutAreaType[] => {
  const areasForBenchmarking: AreaWithoutAreaType[] = [
    {
      code: areaCodeForEngland,
      name: 'England',
    },
  ];

  if (
    shouldAddGroupAreaForBenchmarking(
      areasSelected,
      selectedGroupCode,
      selectedGroupArea
    )
  ) {
    const groupArea = healthDataForAreas.find(
      (area) => area.areaCode === selectedGroupCode
    );

    if (groupArea) {
      areasForBenchmarking.push({
        code: groupArea.areaCode,
        name: groupArea.areaName,
      });
    }
  }

  return areasForBenchmarking;
};

export const determineBenchmarkToUse = (
  lineChartAreaSelected?: string
): string => {
  return lineChartAreaSelected ?? areaCodeForEngland;
};
