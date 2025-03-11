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
    return this.mockIndicatorData.find((indicator) => {
      return indicator.indicatorID.toLowerCase() === indicatorId.toLowerCase();
    });
  }
}
