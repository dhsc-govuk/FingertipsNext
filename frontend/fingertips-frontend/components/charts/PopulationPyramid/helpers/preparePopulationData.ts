import {
  HealthDataForArea,
  PeriodType,
  ReportingPeriod,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '../../../../lib/chartHelpers/constants';

export interface PopulationDataForArea {
  total: number;
  areaName?: string;
  areaCode?: string;
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
  maleSeries: Array<number>;
}

export const getLowerBandValue = (range: string) => {
  if (range.includes('+')) return parseInt(range.split('-')[0]);
  return parseInt(range.split('-')[0]);
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
  healthDataForArea: HealthDataForArea | undefined
): PopulationDataForArea | undefined => {
  if (
    !healthDataForArea ||
    !healthDataForArea.indicatorSegments ||
    !healthDataForArea.indicatorSegments[0] ||
    healthDataForArea.indicatorSegments[0]?.healthData?.length !== 1 ||
    healthDataForArea.indicatorSegments[0]?.reportingPeriod !==
      ReportingPeriod.Yearly || // should always show for England
    healthDataForArea.indicatorSegments?.[0]?.healthData[0]?.datePeriod
      ?.type !== PeriodType.Calendar // should always show for England
  ) {
    return undefined;
  }

  const {
    ageCategories,
    maleCounts,
    femaleCounts,
    totalCount: totalPopulation,
  } = getCountsByAgeSex(healthDataForArea);

  return {
    total: totalPopulation ?? 0,
    areaName: healthDataForArea.areaName,
    areaCode: healthDataForArea.areaCode,
    ageCategories: ageCategories,
    femaleSeries: femaleCounts,
    maleSeries: maleCounts,
  };
};

function filterHealthDataForArea(
  dataForAreas: HealthDataForArea[],
  selectedGroupAreaCode: string | undefined
): {
  areasData: HealthDataForArea[] | undefined;
  benchmarkData: HealthDataForArea | undefined;
  groupData: HealthDataForArea | undefined;
} {
  const areasData = dataForAreas.filter(
    (area) =>
      area.areaCode !== selectedGroupAreaCode &&
      area.areaCode !== areaCodeForEngland
  );

  const benchmarkData = dataForAreas.find((area) => {
    const isEnglandAddedAlready =
      areasData.find((search_area) => {
        return search_area.areaCode == area.areaCode;
      }) != undefined;
    return area.areaCode == areaCodeForEngland && !isEnglandAddedAlready;
  });

  let groupData: HealthDataForArea | undefined = undefined;
  if (selectedGroupAreaCode) {
    groupData = dataForAreas.find((area) => {
      return (
        area.areaCode === selectedGroupAreaCode &&
        area.areaCode !== areaCodeForEngland
      );
    });
  }
  return { areasData, benchmarkData, groupData };
}

interface PyramidPopulationData {
  pyramidDataForAreas: PopulationDataForArea[] | undefined;
  pyramidDataForEngland?: PopulationDataForArea;
  pyramidDataForGroup?: PopulationDataForArea;
}

export const createPyramidPopulationData = (
  dataForAreas: HealthDataForArea[],
  groupAreaCode: string = ''
): PyramidPopulationData => {
  const { areasData, benchmarkData, groupData } = filterHealthDataForArea(
    dataForAreas,
    groupAreaCode
  );

  let pyramidDataForAreas;
  if (areasData) {
    pyramidDataForAreas = areasData
      .map((area) => convertHealthDataForAreaForPyramidData(area))
      .filter((data) => data !== undefined);
  }
  const pyramidDataForEngland =
    convertHealthDataForAreaForPyramidData(benchmarkData);
  const pyramidDataForGroup = convertHealthDataForAreaForPyramidData(groupData);
  return {
    pyramidDataForAreas,
    pyramidDataForEngland,
    pyramidDataForGroup,
  };
};

function getCountsByAgeSex(healthDataForArea: HealthDataForArea): {
  ageCategories: string[];
  maleCounts: number[];
  femaleCounts: number[];
  totalCount: number;
} {
  if (!healthDataForArea.indicatorSegments)
    return {
      ageCategories: [],
      maleCounts: [],
      femaleCounts: [],
      totalCount: 0,
    };
  const { sexCountByAge, totalCount } =
    healthDataForArea.indicatorSegments.reduce(
      (acc, segment) => {
        const age = segment.age.value.replace('yrs', '').replace('-', ' to ');
        const sex = segment.sex.value;

        if (!age.includes('All') && (sex === 'Male' || sex === 'Female')) {
          const count = segment.healthData?.[0]?.count ?? undefined;

          if (!acc.sexCountByAge[age]) {
            acc.sexCountByAge[age] = { male: undefined, female: undefined };
          }

          acc.sexCountByAge[age][sex.toLowerCase() as 'male' | 'female'] =
            count;
          if (typeof count === 'number') {
            acc.totalCount += count;
          }
        }

        return acc;
      },
      {
        sexCountByAge: {} as Record<
          string,
          { male?: number | undefined; female?: number | undefined }
        >,
        totalCount: 0,
      }
    );

  const sortedAgeCategories = Object.keys(sexCountByAge).sort((a, b) => {
    const parseStart = (label: string) =>
      parseInt(label.replace('+', '').split(' ')[0], 10); // "90+" or "75 to 79"
    return parseStart(b) - parseStart(a); // descending
  });

  const maleCountsAlignedToAgeCategories = sortedAgeCategories.map(
    (age) => sexCountByAge[age].male ?? 0
  );
  const femaleCountsAlignedToAgeCategories = sortedAgeCategories.map(
    (age) => sexCountByAge[age].female ?? 0
  );
  return {
    ageCategories: sortedAgeCategories,
    maleCounts: maleCountsAlignedToAgeCategories,
    femaleCounts: femaleCountsAlignedToAgeCategories,
    totalCount,
  };
}
