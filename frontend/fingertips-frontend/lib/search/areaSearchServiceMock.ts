import { IAreaSearchService, AreaDocument } from './searchTypes';

export class AreaSearchServiceMock implements IAreaSearchService {
  mockAreaData: AreaDocument[];

  constructor(areaData: AreaDocument[]) {
    this.mockAreaData = areaData;
  }

  public async getArea(areaCode: string): Promise<AreaDocument | undefined> {
    return this.mockAreaData.find((areaDoc) => areaDoc.areaCode === areaCode);
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
