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
}
