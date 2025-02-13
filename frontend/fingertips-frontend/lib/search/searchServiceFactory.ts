import { AreaSearchService } from './areaSearchService';
import { AreaSearchServiceMock } from './areaSearchServiceMock';
import { IndicatorSearchService } from './indicatorSearchService';
import {
  AreaDocument,
  IndicatorDocument,
  IAreaSearchService,
  IIndicatorSearchService,
} from './searchTypes';
import mockAreaData from '../../assets/mockAreaData.json';
import mockIndicatorData from '../../assets/mockIndicatorData.json';
import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import { readEnvVar, tryReadEnvVar } from '../envUtils';

export class SearchServiceFactory {
  private static readonly DISTRICT_AREA_TYPE_NAME =
    'Districts and Unitary Authorities';
  private static areaSearchServiceInstance: IAreaSearchService | null;
  private static indicatorSearchServiceInstance: IIndicatorSearchService | null;

  private static readonly ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES = 'E06';
  private static readonly ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS = 'E08';
  private static readonly ONS_AREA_TYPE_CODE_LONDON_BOROUGHS = 'E09';

  /*
   * The following code is duplicated between the search-setup project and here.
   * Both have to make the same updates to the areaData. It is preferrable to make
   * this shared code common by creating a shared package but the Typescript,
   * Javascript, Jest and eslint tooling is not currently in place to support this
   *
   * Duplicated functions are
   *  - isDualLevelArea
   *  - createDistrictLevelFromCounty
   */
  private static isDualLevelArea({ areaCode }: AreaDocument): boolean {
    return (
      areaCode.startsWith(
        SearchServiceFactory.ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES
      ) ||
      areaCode.startsWith(
        SearchServiceFactory.ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS
      ) ||
      areaCode.startsWith(
        SearchServiceFactory.ONS_AREA_TYPE_CODE_LONDON_BOROUGHS
      )
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
      const someDate = new Date('15-Mar-2007');
      const unparsedIndicatorData = mockIndicatorData as IndicatorDocument[];
      const typedIndicatorData = unparsedIndicatorData.map(({
        indicatorID,
        indicatorName,
        indicatorDefinition,
        dataSource,
      }): IndicatorDocument => {
        if (!indicatorName) console.log(indicatorID);
        return {
          indicatorID: String(indicatorID),
          indicatorName,
          indicatorDefinition,
          dataSource,
          latestDataPeriod: '2022',
          lastUpdated: someDate,
        };
      });
      const service = new IndicatorSearchServiceMock(typedIndicatorData);
      return service;
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
