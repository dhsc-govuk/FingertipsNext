import { config } from "dotenv";
import { AreaDocument, DISTRICT_AREA_TYPE_NAME } from "../constants.js";

export function getEnvironmentVariable(variableName: string): string {
  config();

  const variableValue = process.env[variableName];
  if (!variableValue) {
    throw new Error(`Could not load environment variable ${variableName}!`);
  }

  return variableValue;
}

function createUniqueKey(areaCode: string, areaType: string): string {
  return `${areaCode}_${areaType.toLowerCase().replace(/ /g, '-')}`;
}

export function parseAreaData(rawAreaData: object): AreaDocument[] {
  const unparsedAreaData = rawAreaData as AreaDocument[];
  const parseAreaData = unparsedAreaData.map(({ areaCode, areaName, areaType }): AreaDocument => { return { areaKey: `${createUniqueKey(areaCode, areaType)}`, areaCode, areaName, areaType } })
  return parseAreaData;
}

function isDualLevelArea({ areaCode }: AreaDocument): boolean {
  return (areaCode.startsWith('E06') || areaCode.startsWith('E08') || areaCode.startsWith('E09'))
}

// This needs to duplicate E09, E08 and E06 area types. These are initially modelled as COUNTY level but need duplicating as DISTRICT LEVEL
export function createDistrictLevelFromCounty(areaData: AreaDocument[]) {
  const countyLevel = areaData.filter(isDualLevelArea);
  const newDistrictLevel = countyLevel.map(({ areaCode, areaName }: AreaDocument): AreaDocument => { return { areaKey: `${createUniqueKey(areaCode, DISTRICT_AREA_TYPE_NAME)}`, areaCode, areaName, areaType: DISTRICT_AREA_TYPE_NAME } });
  return newDistrictLevel;
}
