import {
  IIndicatorSearchService,
  IndicatorDocument,
  IndicatorSearchResult,
} from './searchTypes';

export class IndicatorSearchServiceMock implements IIndicatorSearchService {
  mockIndicatorData: IndicatorDocument[];

  constructor(indicatorData: IndicatorDocument[]) {
    this.mockIndicatorData = indicatorData;
  }

  public async searchWith(
    searchText: string
  ): Promise<IndicatorSearchResult[]> {
    return this.mockIndicatorData
      .filter((indicator) => {
        return (
          indicator.name.includes(searchText) ||
          indicator.definition.includes(searchText)
        );
      })
      .slice(0, 20);
  }
}
