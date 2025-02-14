import { config } from 'dotenv';
import {
  AreaDocument,
  DISTRICT_AREA_TYPE_NAME,
  IndicatorDocument,
  ONS_AREA_TYPE_CODE_LONDON_BOROUGHS,
  ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS,
  ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES,
} from '../constants.js';

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

export function parseIndicatorData(
  rawIndicatorData: object
): IndicatorDocument[] {
  const someDate = new Date('15-Mar-2007');
  const unparsedIndicatorData = rawIndicatorData as IndicatorDocument[];
  const parseIndicatorData = unparsedIndicatorData.map(
    ({
      indicatorID,
      indicatorName,
      indicatorDefinition,
      dataSource,
      associatedAreaCodes
    }): IndicatorDocument => {
      return {
        indicatorID: String(indicatorID),
        indicatorName,
        indicatorDefinition,
        dataSource,
        latestDataPeriod: '2022',
        lastUpdated: someDate,
        associatedAreaCodes
      };
    }
  );
  return parseIndicatorData;
}

function isDualLevelArea({ areaCode }: AreaDocument): boolean {
  return (
    areaCode.startsWith(ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES) ||
    areaCode.startsWith(ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS) ||
    areaCode.startsWith(ONS_AREA_TYPE_CODE_LONDON_BOROUGHS)
  );
}

// This needs to duplicate E09, E08 and E06 area types. These are initially modelled as COUNTY level but need duplicating as DISTRICT LEVEL
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
