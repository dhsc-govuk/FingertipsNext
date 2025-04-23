import { DISTRICT_AREA_TYPE_NAME, ONS_AREA_TYPE_CODE_LONDON_BOROUGHS, ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS, ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES, } from '../constants.js';
// This needs to duplicate E09, E08 and E06 area types. These are initially modelled as COUNTY level but need duplicating as DISTRICT LEVEL
export function parseAreaData(rawAreaData) {
    const unparsedAreaData = rawAreaData;
    const parseAreaData = unparsedAreaData.map(({ areaCode, areaName, areaType }) => {
        return {
            areaKey: `${createUniqueKey(areaCode, areaType)}`,
            areaCode,
            areaName,
            areaType,
        };
    });
    return parseAreaData;
}
export function createDistrictLevelFromCounty(areaData) {
    const countyLevel = areaData.filter(isDualLevelArea);
    const newDistrictLevel = countyLevel.map(({ areaCode, areaName }) => {
        return {
            areaKey: `${createUniqueKey(areaCode, DISTRICT_AREA_TYPE_NAME)}`,
            areaCode,
            areaName,
            areaType: DISTRICT_AREA_TYPE_NAME,
        };
    });
    return newDistrictLevel;
}
function isDualLevelArea({ areaCode }) {
    return (areaCode.startsWith(ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES) ||
        areaCode.startsWith(ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS) ||
        areaCode.startsWith(ONS_AREA_TYPE_CODE_LONDON_BOROUGHS));
}
function createUniqueKey(areaCode, areaType) {
    return `${areaCode}_${areaType.toLowerCase().replace(/ /g, '-')}`;
}
