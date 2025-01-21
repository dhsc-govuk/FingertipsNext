import { IAreaSearchService, AreaDocument } from './searchTypes';

export class AreaSearchServiceMock implements IAreaSearchService {
  public static getInstance(): AreaSearchServiceMock {
    if (!AreaSearchServiceMock.#instance)
      throw new Error("Instance doesn't exist");
    return AreaSearchServiceMock.#instance;
  }

  static #instance: AreaSearchServiceMock;

  mockAreaData: AreaDocument[];

  constructor(areaData: AreaDocument[]) {
    this.mockAreaData = areaData;
  }

  public async getAreaSuggestions(
    partialAreaName: string
  ): Promise<AreaDocument[]> {
    return this.mockAreaData
      .filter((areaDoc) => {
        return (
          areaDoc.areaCode.includes(partialAreaName) ||
          areaDoc.areaName.includes(partialAreaName)
        );
      })
      .slice(0, 20);
  }
}
