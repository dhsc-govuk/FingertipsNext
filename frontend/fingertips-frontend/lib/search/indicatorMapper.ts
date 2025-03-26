/*********************************************************************************
 * Mapper class for handling conversions from the indicator search backend to entities.
 */

import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';
import {
  AreaCodeWithTrend,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';

export class IndicatorMapper {
  public toEntities(
    rawIndicators: RawIndicatorDocument[],
    areaCodes: string[]
  ): IndicatorDocument[] {
    return rawIndicators.map((rawIndicator) =>
      this.toEntity(rawIndicator, areaCodes)
    );
  }

  /**
   * Finds the trend for an indicator in a given area. Will return null if user has requested more than one area
   * (in which case it would make no sense to return a value) or if there is no match for the requested area.
   *
   * @param requestedAreaCodes - list of area codes requested by the user for the given indicator
   * @param trendsWithAreas - the list of area to trend mappings for the given indicator
   * @returns - the trend string e.g. Increasing and getting worse
   */
  private getTrendForIndicatorInArea(
    requestedAreaCodes: string[],
    trendsWithAreas: AreaCodeWithTrend[]
  ): HealthDataPointTrendEnum | undefined {
    if (requestedAreaCodes.length !== 1) {
      return undefined;
    }

    const matchedElement = trendsWithAreas.find(
      (trendWithArea) => trendWithArea.areaCode === requestedAreaCodes[0]
    );

    return !matchedElement ? undefined : matchedElement.trend;
  }

  public toEntity(
    rawIndicator: RawIndicatorDocument,
    requestedAreaCodes: string[]
  ): IndicatorDocument {
    return {
      indicatorID: rawIndicator.indicatorID,
      indicatorName: rawIndicator.indicatorName,
      indicatorDefinition: rawIndicator.indicatorDefinition,
      trend: this.getTrendForIndicatorInArea(
        requestedAreaCodes,
        rawIndicator.trendsByArea
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
