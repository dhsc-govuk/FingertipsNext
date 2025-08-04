import { RawIndicatorDocument, AreaDocument } from '@/lib/search/searchTypes';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
import {
  IndicatorMode,
  IndicatorInfo,
  SimpleIndicatorDocument,
} from './genericTestUtilities';
import { spaceSeparatedPattern } from '@/lib/constants';

const indicatorsUsedInPOC = (indicator: RawIndicatorDocument): boolean =>
  indicator.usedInPoc === true;

const indicatorsMatchingSearchTerm = (
  indicator: RawIndicatorDocument,
  normalizedSearchTerm: string
): boolean => {
  // Check if searched for text is a space-separated list of numbers
  if (spaceSeparatedPattern.test(normalizedSearchTerm)) {
    // Parse indicator IDs and match exactly
    const indicatorIds = normalizedSearchTerm
      .split(/\s+/)
      .filter((id) => id.length > 0);

    return indicatorIds.includes(indicator.indicatorID.toString());
  }

  const lowerSearchTerm = normalizedSearchTerm.toLowerCase();
  return (
    indicator.indicatorID.toString().includes(lowerSearchTerm) ||
    indicator.indicatorName.toLowerCase().trim().includes(lowerSearchTerm) ||
    indicator.indicatorDefinition.toLowerCase().trim().includes(lowerSearchTerm)
  );
};

const indicatorMatchingIndicatorID = (
  indicator: RawIndicatorDocument,
  indicatorID: string
): boolean => {
  const indicatorIDString = String(indicator.indicatorID);

  return indicatorIDString.toLowerCase() === indicatorID.toLowerCase();
};

export function getAllIndicators(
  indicators: RawIndicatorDocument[]
): SimpleIndicatorDocument[] {
  return indicators
    .filter((indicator) => indicatorsUsedInPOC(indicator))
    .map((indicator) => ({
      indicatorName: indicator.indicatorName,
      indicatorID: indicator.indicatorID,
      associatedAreaCodes: indicator.associatedAreaCodes,
      dataSource: indicator.dataSource,
    }));
}

export function getAllIndicatorsForSearchTerm(
  indicators: RawIndicatorDocument[],
  searchTerm: string
): SimpleIndicatorDocument[] {
  if (!searchTerm) return [];
  const trimmedSearchTerm = searchTerm.trim();
  return indicators
    .filter(
      (indicator) =>
        indicatorsUsedInPOC(indicator) &&
        indicatorsMatchingSearchTerm(indicator, trimmedSearchTerm)
    )
    .map((indicator) => ({
      indicatorName: indicator.indicatorName,
      indicatorID: indicator.indicatorID,
      associatedAreaCodes: indicator.associatedAreaCodes,
      dataSource: indicator.dataSource,
    }));
}

function getIndicatorDataByIndicatorID(
  indicators: RawIndicatorDocument[],
  indicatorID: string
): SimpleIndicatorDocument[] {
  if (!indicatorID) return [];

  return indicators
    .filter((indicator) => indicatorMatchingIndicatorID(indicator, indicatorID))
    .map((indicator) => ({
      indicatorName: indicator.indicatorName,
      indicatorID: indicator.indicatorID,
      associatedAreaCodes: indicator.associatedAreaCodes,
      dataSource: indicator.dataSource,
    }));
}

export function returnIndicatorIDsByIndicatorMode(
  indicators: string[],
  indicatorMode: IndicatorMode
): IndicatorInfo[] {
  switch (indicatorMode) {
    case IndicatorMode.ONE_INDICATOR:
      return [{ indicatorID: indicators[0] }];
    case IndicatorMode.TWO_INDICATORS:
      return [{ indicatorID: indicators[0] }, { indicatorID: indicators[1] }];
    case IndicatorMode.THREE_PLUS_INDICATORS:
      return [
        { indicatorID: indicators[0] },
        { indicatorID: indicators[1] },
        { indicatorID: indicators[2] },
      ];
    default:
      throw new Error('Invalid indicator mode');
  }
}

// This function gets the selected indicators indicator data and merges its knownTrend into one object
export function mergeIndicatorData(
  selectedIndicators: IndicatorInfo[],
  typedIndicatorData: RawIndicatorDocument[]
): SimpleIndicatorDocument[] {
  let selectedIndicatorsData: SimpleIndicatorDocument[] = [];

  for (const selectedIndicator of selectedIndicators) {
    const indicatorDataArray = getIndicatorDataByIndicatorID(
      typedIndicatorData,
      selectedIndicator.indicatorID
    );

    // Add the knownTrend, unpublished data year and hasSegmentation boolean to all returned selected indicators
    const enhancedIndicatorData = indicatorDataArray.map((indicator) => ({
      ...indicator,
      knownTrend: selectedIndicator.knownTrend,
      unpublishedDataYear: selectedIndicator.unpublishedDataYear,
      segmentationData: selectedIndicator.segmentationData,
    }));

    selectedIndicatorsData = [
      ...selectedIndicatorsData,
      ...enhancedIndicatorData,
    ];
  }

  return selectedIndicatorsData;
}

export function getAllAreasByAreaType(
  areas: AreaDocument[],
  areaType: AreaTypeKeys
): AreaDocument[] {
  const sanitisedAreaType = areaType.toLowerCase().replaceAll('-', ' ');

  return areas.filter((area) =>
    area.areaType.toLowerCase().includes(sanitisedAreaType)
  );
}

export function getAllIndicatorIDsForSearchTerm(
  indicators: RawIndicatorDocument[],
  searchTerm: string
): string[] {
  if (!searchTerm) return [];

  const lowerCasedSearchTerm = searchTerm.toLowerCase();
  return indicators
    .filter(
      (indicator) =>
        indicatorsUsedInPOC(indicator) &&
        indicatorsMatchingSearchTerm(indicator, lowerCasedSearchTerm)
    )
    .map((indicator) => indicator.indicatorID);
}
