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
          indicator.indicatorID.includes(searchText) ||
          indicator.indicatorName.includes(searchText) ||
          indicator.indicatorDefinition.includes(searchText)
        );
      })
      .filter((indicator) => {
        return (
          !areaCodes ||
          indicator.associatedAreaCodes.some((area) => areaCodes.includes(area))
        );
      })
      .slice(0, 20);
  }

  public async getIndicator(
    indicatorId: string
  ): Promise<IndicatorDocument | undefined> {
    const rawDocument = this.mockIndicatorData.find((indicator) => {
      return indicator.indicatorID === indicatorId;
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
