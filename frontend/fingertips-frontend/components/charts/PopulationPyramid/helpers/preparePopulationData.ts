import {
  HealthDataPoint,
  HealthDataForArea,
  DatePeriod,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '../../../../lib/chartHelpers/constants';
import {
  getLatestPeriodForAreas,
  getLatestYear,
} from '../../../../lib/chartHelpers/chartHelpers';

export interface PopulationDataForArea {
  total: number;
  areaName?: string;
  areaCode?: string;
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
  maleSeries: Array<number>;
}

const removeDuplicateDataPointByAgeBand = (dataPoints: HealthDataPoint[]) => {
  const seenPoints = new Set<string>();
  return dataPoints.filter((value) => {
    if (!seenPoints.has(value.ageBand.value)) {
      seenPoints.add(value.ageBand.value);
      return true;
    }
    return false;
  });
};

export const getLowerBandValue = (range: string) => {
  if (range.includes('+')) return parseInt(range.split('-')[0]);
  return parseInt(range.split('-')[0]);
};

const sortHealthDataByAgeBand = (data: HealthDataPoint[]) => {
  return data.sort((a, b) => {
    return getLowerBandValue(a.ageBand.value) >
      getLowerBandValue(b.ageBand.value)
      ? -1
      : 1;
  });
};

export function computeDataPercentages(
  data: (undefined | number)[],
  totalPopulation: number
): Array<number> {
  if (!data) return [];
  return data.map((value: number | undefined) => {
    const percentage = ((value ?? 0) / totalPopulation) * 100;
    return parseFloat(percentage.toFixed(2));
  });
}

export const convertHealthDataForAreaForPyramidData = (
  healthDataForArea: HealthDataForArea | undefined,
  year: number | undefined,
  mostReccentPeriod: Date
): PopulationDataForArea | undefined => {
  if (!healthDataForArea) {
    return undefined;
  }
  let ageCategories: string[] = [];
  let femaleSeries: number[] = [];
  let maleSeries: number[] = [];
  let totalPopulation = 0;

  if (healthDataForArea) {
    const maleFemaleDataPoints = healthDataForArea.healthData.filter(
      (value) => {
        if (
          !value.ageBand.value.includes('All') &&
          (value.sex.value == 'Male' || value.sex.value == 'Female') &&
          mostReccentPeriod.getDate() === value.datePeriod?.to.getDate()
          // (year ? year == value.year : true)
        ) {
          return true;
        }
        return false;
      }
    );
    const maleDataPoints = sortHealthDataByAgeBand(
      removeDuplicateDataPointByAgeBand(
        maleFemaleDataPoints.filter((value) => {
          return value.sex.value == 'Male';
        })
      )
    );
    const femaleDataPoints = sortHealthDataByAgeBand(
      removeDuplicateDataPointByAgeBand(
        maleFemaleDataPoints.filter((value) => {
          return value.sex.value == 'Female';
        })
      )
    );

    ageCategories = femaleDataPoints.map((point) =>
      point.ageBand.value.replace('yrs', '').replace('-', ' to ')
    );

    totalPopulation = femaleDataPoints.reduce((prev, { count }) => {
      return prev + (count ?? 0);
    }, 0);
    totalPopulation = maleDataPoints.reduce((prev, { count }) => {
      return prev + (count ?? 0);
    }, totalPopulation);
    femaleSeries = femaleDataPoints.map((data) => {
      return data.count ?? 0;
    });
    maleSeries = maleDataPoints.map((data) => {
      return data.count ?? 0;
    });
  }

  return {
    total: totalPopulation,
    areaName: healthDataForArea.areaName,
    areaCode: healthDataForArea.areaCode,
    ageCategories: ageCategories,
    femaleSeries: femaleSeries,
    maleSeries: maleSeries,
  };
};

const filterHealthDataForArea = (
  dataForAreas: HealthDataForArea[],
  selectedGroupAreaCode: string | undefined
) => {
  if (dataForAreas.length == 1) {
    return { areas: dataForAreas, england: undefined, baseline: undefined };
  }

  const areas = dataForAreas.filter((area: HealthDataForArea, _: number) => {
    return (
      selectedGroupAreaCode != area.areaCode &&
      area.areaCode != areaCodeForEngland
    );
  });

  const benchmark = dataForAreas.find((area: HealthDataForArea, _: number) => {
    const isEnglandAddedAlready =
      areas.find((search_area) => {
        return search_area.areaCode == area.areaCode;
      }) != undefined;
    return area.areaCode == areaCodeForEngland && !isEnglandAddedAlready;
  });

  let group: HealthDataForArea | undefined = undefined;
  if (benchmark && selectedGroupAreaCode) {
    group = dataForAreas.find((area: HealthDataForArea, _: number) => {
      return (
        selectedGroupAreaCode == area.areaCode &&
        benchmark.areaCode != area.areaCode
      );
    });
  }
  return { areas, benchmark, group };
};

export const createPyramidPopulationDataFrom = (
  dataForAreas: HealthDataForArea[],
  groupAreaCode: string
): {
  areas: PopulationDataForArea[];
  benchmark: PopulationDataForArea | undefined;
  group: PopulationDataForArea | undefined;
} => {
  const { areas, benchmark, group } = filterHealthDataForArea(
    dataForAreas,
    groupAreaCode
  );

  // #1201 - change to period
  let year = undefined;
  if (areas.length > 0) {
    year = getLatestYear(areas[0].healthData);
  }

  const mostRecentDate = new Date(getLatestPeriodForAreas(dataForAreas) ?? '');
  if (!mostRecentDate) return; // sort this fallback

  const pyramidAreas = areas
    .map((area) =>
      convertHealthDataForAreaForPyramidData(area, year, mostRecentDate)
    )
    .filter((data) => data !== undefined);
  const pyramidEngland = convertHealthDataForAreaForPyramidData(
    benchmark,
    year,
    mostRecentDate
  );
  const pyramidBaseline = convertHealthDataForAreaForPyramidData(
    group,
    year,
    mostRecentDate
  );
  return {
    areas: pyramidAreas,
    benchmark: pyramidEngland,
    group: pyramidBaseline,
  };
};
