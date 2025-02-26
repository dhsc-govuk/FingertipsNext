import {
  AreaDocument,
  DISTRICT_AREA_TYPE_NAME,
  ONS_AREA_TYPE_CODE_LONDON_BOROUGHS,
  ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS,
  ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES,
} from '../constants.js';

// This needs to duplicate E09, E08 and E06 area types. These are initially modelled as COUNTY level but need duplicating as DISTRICT LEVEL
export function parseAreaData(rawAreaData: object): AreaDocument[] {
  const unparsedAreaData = rawAreaData as AreaDocument[];
  const parseAreaData = unparsedAreaData.map(
    ({ areaCode, areaName, areaType }): AreaDocument => {
      return {
        areaKey: `${createUniqueKey(areaCode, areaType)}`,
        areaCode,
        areaName,
        areaType,
      };
    }
  );
  return parseAreaData;
}

export function createDistrictLevelFromCounty(areaData: AreaDocument[]) {
  const countyLevel = areaData.filter(isDualLevelArea);
  const newDistrictLevel = countyLevel.map(
    ({ areaCode, areaName }: AreaDocument): AreaDocument => {
      return {
        areaKey: `${createUniqueKey(areaCode, DISTRICT_AREA_TYPE_NAME)}`,
        areaCode,
        areaName,
        areaType: DISTRICT_AREA_TYPE_NAME,
      };
    }
  );
  return newDistrictLevel;
}

function isDualLevelArea({ areaCode }: AreaDocument): boolean {
  return (
    areaCode.startsWith(ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES) ||
    areaCode.startsWith(ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS) ||
    areaCode.startsWith(ONS_AREA_TYPE_CODE_LONDON_BOROUGHS)
  );
}

function createUniqueKey(areaCode: string, areaType: string): string {
  return `${areaCode}_${areaType.toLowerCase().replace(/ /g, '-')}`;
}
