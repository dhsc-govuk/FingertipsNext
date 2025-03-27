import { IndicatorMapper } from './indicatorMapper';
import {
  IIndicatorSearchService,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';

export class IndicatorSearchServiceMock implements IIndicatorSearchService {
  private readonly mockIndicatorData: RawIndicatorDocument[];
  private readonly mapper: IndicatorMapper;

  constructor(indicatorData: RawIndicatorDocument[]) {
    this.mockIndicatorData = indicatorData;
    this.mapper = new IndicatorMapper();
  }

  public async searchWith(
    searchText: string,
    isEnglandSelectedAsGroup: boolean,
    areaCodes: string[]
  ): Promise<IndicatorDocument[]> {
    const searchResults = this.mockIndicatorData
      .filter((indicator) => {
        return (
          indicator.indicatorID
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          indicator.indicatorName
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          indicator.indicatorDefinition
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())
        );
      })
      .filter((indicator) => {
        return (
          !areaCodes ||
          indicator.associatedAreaCodes.some((area) =>
            areaCodes
              .map((areaCode) => {
                return areaCode.toLowerCase();
              })
              .includes(area.toLowerCase())
          )
        );
      })
      .slice(0, 20);

    return this.mapper.toEntities(searchResults, areaCodes ?? [], isEnglandSelectedAsGroup);
  }

  public async getIndicator(
    indicatorId: string
  ): Promise<IndicatorDocument | undefined> {
    const rawDocument = this.mockIndicatorData.find((indicator) => {
      return indicator.indicatorID.toLowerCase() === indicatorId.toLowerCase();
    });

    // This restricts the return to _only_ the fields we index in actual AI search
    // otherwise the mock would return extra fields that aren't currently populated

    if (!rawDocument) {
      return undefined;
    }

    return {
      indicatorID: rawDocument.indicatorID,
      indicatorName: rawDocument.indicatorName,
      indicatorDefinition: rawDocument?.indicatorDefinition,
      earliestDataPeriod: rawDocument.earliestDataPeriod,
      latestDataPeriod: rawDocument.latestDataPeriod,
      lastUpdatedDate: rawDocument.lastUpdatedDate,
      dataSource: rawDocument.dataSource,
      hasInequalities: rawDocument.hasInequalities,
      trend: undefined,
      unitLabel: rawDocument.unitLabel,
    };
  }
}
