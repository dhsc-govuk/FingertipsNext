import {
  AreaDocument,
  IAreaSearchClient as IAreaSearchService,
} from './searchTypes';

export class AreaSearchServiceMock implements IAreaSearchService {
  public static getInstance(): AreaSearchServiceMock {
    if (!AreaSearchServiceMock.#instance) {
      AreaSearchServiceMock.#instance = new AreaSearchServiceMock();
    }
    return AreaSearchServiceMock.#instance;
  }

  static #instance: AreaSearchServiceMock;

  private constructor() {}

  public async getAreaSuggestions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _partialAreaName: string
  ): Promise<AreaDocument[]> {
    console.log('AreaSearchServiceMock::getAreaSuggestions');
    const suggestions = [
      { areaCode: '1234', areaType: 'Region', areaName: 'Birmingham' },
      { areaCode: '2345', areaType: 'Region', areaName: 'Manchester' },
      { areaCode: '3456', areaType: 'Region', areaName: 'Bristol' },
      { areaCode: '4567', areaType: 'Region', areaName: 'London' },
      { areaCode: '5678', areaType: 'Region', areaName: 'Leeds' },
    ];

    return suggestions;
  }
}
