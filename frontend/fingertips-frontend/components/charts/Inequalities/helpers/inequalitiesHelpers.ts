import {
  DatePeriod,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { AreaWithoutAreaType } from '@/lib/common-types';

export const localeSort = (a: string, b: string) => a.localeCompare(b);
export const sexCategory = 'Sex';

export enum ChartType {
  SingleTimePeriod = 'single-time-period',
  Trend = 'trend',
}

export type HealthDataGroupedByPeriodAndInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

type InequalityValueSelector = (dataPoint: HealthDataPoint) => string;
export type InequalitySequenceSelector = (
  dataPoint?: HealthDataPoint
) => number;
type HealthDataFilterFunction = (dataPoint: HealthDataPoint) => boolean;

export interface InequalitiesChartData {
  areaCode: string;
  areaName: string;
  rowData: InequalitiesTableRowData[];
}

export interface InequalitiesBarChartData {
  areaCode: string;
  areaName: string;
  data: InequalitiesTableRowData;
}

export interface RowDataFields {
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
  isAggregate?: boolean;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
  sequence?: number;
  datePeriod?: DatePeriod;
}

export interface InequalitiesTableRowData {
  period: string;
  datePeriod?: DatePeriod;
  inequalities: {
    [key: string]: RowDataFields | undefined;
  };
}

export enum InequalitiesTypes {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

export const valueSelectorForInequality: Record<
  InequalitiesTypes,
  InequalityValueSelector
> = {
  [InequalitiesTypes.Sex]: (dataPoint) => dataPoint.sex.value,
  [InequalitiesTypes.Deprivation]: (dataPoint) => dataPoint.deprivation.value,
};

export const sequenceSelectorForInequality: Record<
  InequalitiesTypes,
  InequalitySequenceSelector
> = {
  [InequalitiesTypes.Sex]: () => 0,
  [InequalitiesTypes.Deprivation]: (dataPoint) =>
    dataPoint?.deprivation.sequence ?? 0,
};

export const healthDataFilterFunctionGeneratorForInequality: Record<
  InequalitiesTypes,
  (category: string) => HealthDataFilterFunction
> = {
  [InequalitiesTypes.Sex]: () => (data: HealthDataPoint) =>
    data.deprivation.isAggregate && data.ageBand.isAggregate,
  [InequalitiesTypes.Deprivation]: (category) => (data: HealthDataPoint) =>
    data.sex.isAggregate &&
    data.ageBand.isAggregate &&
    (data.deprivation.isAggregate || data.deprivation.type == category),
};

export const groupHealthDataByPeriod = <T extends { periodLabel?: string }>(
  healthData: T[]
): Record<string, T[] | undefined> =>
  Object.groupBy(healthData, (data) => data.periodLabel ?? 'X');

export const groupHealthDataByInequality = (
  healthData: HealthDataPoint[],
  valueSelector: InequalityValueSelector
) => {
  return Object.groupBy(healthData, (data) => valueSelector(data));
};

export const getHealthDataGroupedByPeriodAndInequalities = (
  healthDataByPeriod: Record<string, HealthDataPoint[] | undefined>,
  valueSelector: InequalityValueSelector
) => {
  const healthDataGroupedByPeriodAndInequality: HealthDataGroupedByPeriodAndInequalities =
    {};

  for (const period in healthDataByPeriod) {
    healthDataGroupedByPeriodAndInequality[period] =
      groupHealthDataByInequality(
        healthDataByPeriod[period] ?? [],
        valueSelector
      );
  }

  return healthDataGroupedByPeriodAndInequality;
};

export const mapToInequalitiesTableData = (
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >,
  sequenceSelector: InequalitySequenceSelector
): InequalitiesTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((period) => {
    let datePeriod: DatePeriod | undefined;
    const dynamicFields = Object.keys(
      yearDataGroupedByInequalities[period]
    ).reduce(
      (acc: Record<string, RowDataFields | undefined>, inequality: string) => {
        const currentTableKey =
          yearDataGroupedByInequalities[period][inequality];

        if (currentTableKey?.at(0)?.datePeriod) {
          datePeriod = currentTableKey.at(0)?.datePeriod as DatePeriod;
        }

        acc[inequality] = currentTableKey?.at(0)
          ? {
              count: currentTableKey[0].count,
              value: currentTableKey[0].value,
              lower: currentTableKey[0].lowerCi,
              upper: currentTableKey[0].upperCi,
              isAggregate: currentTableKey[0].isAggregate,
              benchmarkComparison: currentTableKey[0].benchmarkComparison,
              sequence: sequenceSelector(currentTableKey[0]),
              datePeriod: currentTableKey[0].datePeriod,
            }
          : undefined;
        return acc;
      },
      {}
    );

    return { period, datePeriod, inequalities: { ...dynamicFields } };
  });
};

export const reorderItemsArraysToEnd = (
  headers: string[],
  lastHeaders?: string[]
) => {
  if (!headers) return [];
  if (!lastHeaders) return headers;

  const filterHeaders = headers.filter((header) => {
    return !lastHeaders.includes(header);
  });
  lastHeaders.forEach((header) => {
    if (headers.includes(header)) filterHeaders.push(header);
  });
  return filterHeaders;
};

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: HealthDataGroupedByPeriodAndInequalities,
  sequenceSelector: InequalitySequenceSelector
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], yearDataRecord) => {
    const sortedCurrentYearInequalityNames = Object.entries(yearDataRecord)
      .sort(([aKey], [bKey]) => localeSort(bKey, aKey))
      .sort(
        ([, aValue], [, bValue]) =>
          sequenceSelector(bValue?.[0]) - sequenceSelector(aValue?.[0])
      )
      .map((x) => x[0]);
    allKeys = [...allKeys, ...sortedCurrentYearInequalityNames];
    return allKeys;
  }, []);

  // spreading a set ensures we have unique keys
  return [...new Set(existingKeys)];
};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
) => indicatorsSelected.length === 1 && areasSelected.length === 1;

export const getAggregatePointInfo = (
  inequalities: Record<string, RowDataFields | undefined>
) => {
  const benchmarkPoint = Object.values(inequalities).find(
    (entry) => entry?.isAggregate
  );
  const benchmarkValue = benchmarkPoint?.value;
  const aggregateKey = Object.keys(inequalities).find(
    (key) => inequalities[key]?.isAggregate
  );

  const sortedInequalities = Object.entries(inequalities)
    .sort(([nameA], [nameB]) => localeSort(nameA, nameB))
    .sort(
      ([, inequalityA], [, inequalityB]) =>
        (inequalityB?.sequence ?? 0) - (inequalityA?.sequence ?? 0)
    );
  const sortedKeys = sortedInequalities.map(([key, _inequality]) => key);
  const inequalityDimensions = sortedInequalities
    .filter(([, inequality]) => !inequality?.isAggregate)
    .map(([key, _inequality]) => key);

  return {
    benchmarkPoint,
    benchmarkValue,
    aggregateKey,
    sortedKeys,
    inequalityDimensions,
  };
};

function hasHealthDataForInequalities(
  healthDataForArea: HealthDataForArea,
  inequalityType: InequalitiesTypes,
  period?: string
): boolean {
  if (period) {
    const healthDataPointsForPeriod = healthDataForArea.healthData.filter(
      (point) => point.periodLabel === period
    );

    if (healthDataPointsForPeriod.length === 0) {
      return false;
    }

    return (
      healthDataPointsForPeriod?.filter((healthDataForYear) =>
        inequalityType === InequalitiesTypes.Sex
          ? !healthDataForYear.sex.isAggregate
          : !healthDataForYear.deprivation.isAggregate
      ).length > 0
    );
  }

  const healthDataPointWithInequalities = healthDataForArea?.healthData?.filter(
    (data) =>
      inequalityType === InequalitiesTypes.Sex
        ? !data.sex.isAggregate
        : !data.deprivation.isAggregate
  );

  return healthDataPointWithInequalities.length > 0;
}

export const getAreasWithInequalitiesData = (
  healthIndicatorData: HealthDataForArea[],
  inequalityType: InequalitiesTypes,
  period?: string
) => {
  const areasWithInequalitiesData: AreaWithoutAreaType[] = [];

  healthIndicatorData.forEach((areaWithHealthData) => {
    if (
      hasHealthDataForInequalities(areaWithHealthData, inequalityType, period)
    ) {
      areasWithInequalitiesData.push({
        code: areaWithHealthData.areaCode,
        name: areaWithHealthData.areaName,
      });
    }
  });

  const sortAreasWithInequalitiesData: AreaWithoutAreaType[] = [];

  const englandAreaWithInequality = areasWithInequalitiesData.find(
    (area) => area.code === areaCodeForEngland
  );

  if (englandAreaWithInequality) {
    sortAreasWithInequalitiesData.push(englandAreaWithInequality);
  }

  const nonEnglandAreasWithInequalitiesSorted = areasWithInequalitiesData
    .filter((area) => area.code !== areaCodeForEngland)
    .toSorted((a, b) => a.name.localeCompare(b.name));

  return sortAreasWithInequalitiesData.concat(
    ...nonEnglandAreasWithInequalitiesSorted
  );
};

export const filterHealthData = (
  healthData: HealthDataPoint[],
  filterFn: HealthDataFilterFunction
): HealthDataPoint[] => {
  return healthData.filter(filterFn);
};

const getInequalityDeprivationCategories = (
  healthIndicatorData: HealthDataForArea,
  selectedPeriod?: string,
  chartType?: ChartType
): string[] => {
  const disaggregatedDeprivationData = healthIndicatorData.healthData.filter(
    (data) =>
      selectedPeriod
        ? data.periodLabel === selectedPeriod && !data.deprivation.isAggregate
        : !data.deprivation.isAggregate
  );

  const groupedByDeprivationType = Object.groupBy(
    disaggregatedDeprivationData,
    (data) => data.deprivation.type
  );

  if (chartType === ChartType.Trend) {
    return Object.entries(groupedByDeprivationType)
      .filter(([, dataPoints]) => {
        const uniquePeriods = new Set(
          dataPoints?.map((data) => data.periodLabel)
        );
        return uniquePeriods.size > 1;
      })
      .map(([type]) => type);
  }

  return Object.keys(groupedByDeprivationType);
};

export const getPeriodsWithInequalityData = (
  allData: InequalitiesTableRowData[]
): string[] =>
  allData.reduce((acc: string[], periodData: InequalitiesTableRowData) => {
    if (
      !(
        Object.keys(periodData.inequalities).length === 1 &&
        periodData.inequalities[Object.keys(periodData.inequalities)[0]]
          ?.isAggregate
      )
    )
      acc.push(periodData.period);
    return acc;
  }, []);

export const isSexTypePresent = (
  dataPoints: HealthDataPoint[],
  selectedPeriod?: string
): boolean => {
  if (selectedPeriod) {
    return dataPoints.some(
      (point) => !point.sex.isAggregate && point.periodLabel === selectedPeriod
    );
  }
  return dataPoints.some((point) => !point.sex.isAggregate);
};

export const getInequalityCategories = (
  healthIndicatorData: HealthDataForArea,
  selectedPeriod?: string,
  chartType?: ChartType
) => {
  const hasSexType = isSexTypePresent(
    healthIndicatorData.healthData,
    selectedPeriod
  );

  return hasSexType
    ? [
        ...getInequalityDeprivationCategories(
          healthIndicatorData,
          selectedPeriod,
          chartType
        ),
        sexCategory,
      ].toSorted(localeSort)
    : getInequalityDeprivationCategories(
        healthIndicatorData,
        selectedPeriod,
        chartType
      );
};

export const getInequalitiesType = (
  inequalityCategories: string[],
  inequalityTypeSelected?: string
): InequalitiesTypes => {
  if (
    (!inequalityTypeSelected && inequalityCategories[0] === sexCategory) ||
    inequalityTypeSelected === sexCategory
  )
    return InequalitiesTypes.Sex;
  return InequalitiesTypes.Deprivation;
};
