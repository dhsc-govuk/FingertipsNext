import { AreaSearchService } from './areaSearchService';
import { AreaSearchServiceMock } from './areaSearchServiceMock';
import { IndicatorSearchService } from './indicatorSearchService';
import { IAreaSearchService, IIndicatorSearchService } from './searchTypes';
import mockAreaData from '../../assets/mockAreaData.json';
import mockIndicatorData from '../../assets/mockIndicatorData.json';
import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import { readEnvVar, tryReadEnvVar } from '../utils';

export class SearchServiceFactory {
  static #areaSearchServiceInstance: IAreaSearchService;
  static #indicatorSearchServiceInstance: IIndicatorSearchService;

  private static buildAreaSearchService(): IAreaSearchService {
    const useMockServer = tryReadEnvVar('DHSC_AI_SEARCH_USE_MOCK_SERVICE');
    console.log(`buildAreaSearchService: useMockService: ${useMockServer}`);
    return useMockServer === 'true'
      ? new AreaSearchServiceMock(mockAreaData)
      : new AreaSearchService(
          readEnvVar('DHSC_AI_SEARCH_SERVICE_URL'),
          readEnvVar('DHSC_AI_SEARCH_API_KEY')
        );
  }

  private static buildIndicatorSearchService(): IIndicatorSearchService {
    const useMockServer = tryReadEnvVar('DHSC_AI_SEARCH_USE_MOCK_SERVICE');
    console.log(
      `buildIndicatorSearchService: useMockService: ${useMockServer}`
    );
    if (useMockServer === 'true') {
      const typedIndicatorData = mockIndicatorData.map((indicator) => {
        return {
          ...indicator,
          lastUpdated: new Date(indicator.lastUpdated),
        };
      });
      return new IndicatorSearchServiceMock(typedIndicatorData);
    } else {
      return new IndicatorSearchService(
        readEnvVar('DHSC_AI_SEARCH_SERVICE_URL'),
        readEnvVar('DHSC_AI_SEARCH_API_KEY')
      );
    }
  }

  public static getAreaSearchService(): IAreaSearchService {
    if (!this.#areaSearchServiceInstance)
      this.#areaSearchServiceInstance = this.buildAreaSearchService();

    return this.#areaSearchServiceInstance;
  }

  public static getIndicatorSearchService(): IIndicatorSearchService {
    if (!this.#indicatorSearchServiceInstance)
      this.#indicatorSearchServiceInstance = this.buildIndicatorSearchService();

    return this.#indicatorSearchServiceInstance;
  }
}
