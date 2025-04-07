import { AreaSearchService } from './areaSearchService';
import { IndicatorSearchService } from './indicatorSearchService';
import {
  AREA_SEARCH_INDEX_NAME,
  INDICATOR_SEARCH_INDEX_NAME,
  IAreaSearchService,
  IIndicatorSearchService,
} from './searchTypes';
import { readEnvVar, tryReadEnvVar } from '../envUtils';
import { EnvironmentVariables } from '@/EnvironmentVariables';

export class SearchServiceFactory {
  private static areaSearchServiceInstance: IAreaSearchService | null;
  private static indicatorSearchServiceInstance: IIndicatorSearchService | null;

  public static getAreaSearchService(): IAreaSearchService {
    if (!this.areaSearchServiceInstance)
      this.areaSearchServiceInstance = this.buildAreaSearchService();

    return this.areaSearchServiceInstance;
  }

  public static getIndicatorSearchService(): IIndicatorSearchService {
    if (!this.indicatorSearchServiceInstance)
      this.indicatorSearchServiceInstance = this.buildIndicatorSearchService();

    return this.indicatorSearchServiceInstance;
  }

  public static reset() {
    this.areaSearchServiceInstance = null;
    this.indicatorSearchServiceInstance = null;
  }

  private static buildAreaSearchService(): IAreaSearchService {
    return new AreaSearchService(
        readEnvVar(EnvironmentVariables.DHSC_AI_SEARCH_SERVICE_URL),
        readEnvVar(EnvironmentVariables.DHSC_AI_SEARCH_API_KEY),
        tryReadEnvVar(EnvironmentVariables.AREA_SEARCH_INDEX_NAME) ??
        AREA_SEARCH_INDEX_NAME
    );
  }

  private static buildIndicatorSearchService(): IIndicatorSearchService {
    return new IndicatorSearchService(
        readEnvVar(EnvironmentVariables.DHSC_AI_SEARCH_SERVICE_URL),
        readEnvVar(EnvironmentVariables.DHSC_AI_SEARCH_API_KEY),
        tryReadEnvVar(EnvironmentVariables.INDICATOR_SEARCH_INDEX_NAME) ??
        INDICATOR_SEARCH_INDEX_NAME
    );
  }
}
