import { IIndicatorSearchService, IndicatorDocument } from './searchTypes';

export class IndicatorSearchServiceMock implements IIndicatorSearchService {
  mockIndicatorData: IndicatorDocument[];

  constructor(indicatorData: IndicatorDocument[]) {
    this.mockIndicatorData = indicatorData;
  }

  public async searchWith(
    searchText: string,
    areaCodes: string[]
  ): Promise<IndicatorDocument[]> {
    return this.mockIndicatorData
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
      associatedAreaCodes: rawDocument.associatedAreaCodes,
      hasInequalities: rawDocument.hasInequalities,
      unitLabel: rawDocument.unitLabel,
      usedInPoc: rawDocument.usedInPoc,
    };
  }
}
