import { AreaSearchService } from './areaSearchService';
import { AreaSearchServiceMock } from './areaSearchServiceMock';
import { IndicatorSearchService } from './indicatorSearchService';
import {
  AreaDocument,
  IAreaSearchService,
  IIndicatorSearchService,
} from './searchTypes';
import mockAreaData from '../../assets/mockAreaData.json';
import mockIndicatorData from '../../assets/mockIndicatorData.json';
import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import { readEnvVar, tryReadEnvVar } from '../envUtils';

export class SearchServiceFactory {
  private static DISTRICT_AREA_TYPE_NAME = 'Districts and Unitary Authorities';
  private static areaSearchServiceInstance: IAreaSearchService | null;
  private static indicatorSearchServiceInstance: IIndicatorSearchService | null;

  private static isDualLevelArea({ areaCode }: AreaDocument): boolean {
    return (
      areaCode.startsWith('E06') ||
      areaCode.startsWith('E08') ||
      areaCode.startsWith('E09')
    );
  }

  // This needs to duplicate E09, E08 and E06 area types. These are initially modelled as COUNTY level but need duplicating as DISTRICT LEVEL
  private static createDistrictLevelFromCounty(areaData: AreaDocument[]) {
    const countyLevel = areaData.filter(this.isDualLevelArea);
    const newDistrictLevel = countyLevel.map(
      ({ areaCode, areaName }: AreaDocument): AreaDocument => {
        return { areaCode, areaName, areaType: this.DISTRICT_AREA_TYPE_NAME };
      }
    );
    return newDistrictLevel;
  }

  private static buildAreaSearchServiceMock(mockAreaData: AreaDocument[]) {
    const newDistrictAreas = this.createDistrictLevelFromCounty(mockAreaData);
    const extendedAreaData = mockAreaData.concat(newDistrictAreas);

    return new AreaSearchServiceMock(extendedAreaData);
  }

  private static buildAreaSearchService(): IAreaSearchService {
    const useMockServer = tryReadEnvVar('DHSC_AI_SEARCH_USE_MOCK_SERVICE');
    console.log(`buildAreaSearchService: useMockService: ${useMockServer}`);
    return useMockServer === 'true'
      ? this.buildAreaSearchServiceMock(mockAreaData)
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
}
