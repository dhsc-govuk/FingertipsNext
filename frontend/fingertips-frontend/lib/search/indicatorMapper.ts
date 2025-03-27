/*********************************************************************************
 * Mapper class for handling conversions from the indicator search backend to entities.
 */

import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';
import {
  AreaCodeWithTrend,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';
import { areaCodeForEngland } from '../chartHelpers/constants';

export class IndicatorMapper {
  public toEntities(
    rawIndicators: RawIndicatorDocument[],
    areaCodes: string[],
    isEnglandSelectedAsGroup: boolean
  ): IndicatorDocument[] {
    return rawIndicators.map((rawIndicator) =>
      this.toEntity(rawIndicator, areaCodes, isEnglandSelectedAsGroup)
    );
  }

  /**
   * Finds the trend for an indicator in a given area. Will return undefined if user has requested more than one area
   * (in which case it would make no sense to return a value) or if there is no match for the requested area.
   *
   * There is an additional case where no specific area is selected but England has been chosen as the group. In this case
   * we return the trend for England.
   *
   * @param requestedAreaCodes - list of area codes requested by the user for the given indicator
   * @param trendsWithAreas - the list of area to trend mappings for the given indicator
   * @param isEnglandSelectedAsGroup - the list of area to trend mappings for the given indicator
   * @returns - the trend string e.g. Increasing and getting worse
   */
  private getTrendForIndicatorInArea(
    requestedAreaCodes: string[],
    trendsWithAreas: AreaCodeWithTrend[],
    isEnglandSelectedAsGroup: boolean
  ): HealthDataPointTrendEnum | undefined {
    if (requestedAreaCodes.length > 1) {
      return undefined;
    }

    const areaCodeToMatch =
      isEnglandSelectedAsGroup && requestedAreaCodes.length === 0
        ? areaCodeForEngland
        : requestedAreaCodes[0];

    const matchedElement = trendsWithAreas.find(
      (trendWithArea) => trendWithArea.areaCode === areaCodeToMatch
    );

    return !matchedElement ? undefined : matchedElement.trend;
  }

  public toEntity(
    rawIndicator: RawIndicatorDocument,
    requestedAreaCodes: string[],
    isEnglandSelectedAsGroup: boolean
  ): IndicatorDocument {
    return {
      indicatorID: rawIndicator.indicatorID,
      indicatorName: rawIndicator.indicatorName,
      indicatorDefinition: rawIndicator.indicatorDefinition,
      trend: this.getTrendForIndicatorInArea(
        requestedAreaCodes,
        rawIndicator.trendsByArea,
        isEnglandSelectedAsGroup
      ),
      dataSource: rawIndicator.dataSource,
      earliestDataPeriod: rawIndicator.earliestDataPeriod,
      latestDataPeriod: rawIndicator.latestDataPeriod,
      lastUpdatedDate: rawIndicator.lastUpdatedDate,
      hasInequalities: rawIndicator.hasInequalities,
      unitLabel: rawIndicator.unitLabel,
    } as IndicatorDocument;
  }
}
