import { IAreaSearchService, AreaDocument } from './searchTypes';

export class AreaSearchServiceMock implements IAreaSearchService {
  mockAreaData: AreaDocument[];

  constructor(areaData: AreaDocument[]) {
    this.mockAreaData = areaData;
  }

  public async getAreaDocument(
    areaCode: string
  ): Promise<AreaDocument | undefined> {
    return this.mockAreaData.find(
      (areaDoc) =>
        areaDoc.areaCode.toLocaleLowerCase() === areaCode.toLocaleLowerCase()
    );
  }

  public async getAreaSuggestions(
    partialAreaName: string
  ): Promise<AreaDocument[]> {
    if (partialAreaName.startsWith('ERROR')) {
      throw new Error(`Mock AI Search Service Error - ${partialAreaName}`);
    }

    return this.mockAreaData
      .filter((areaDoc) => {
        return (
          areaDoc.areaCode
            .toLocaleLowerCase()
            .includes(partialAreaName.toLocaleLowerCase()) ||
          areaDoc.areaName
            .toLocaleLowerCase()
            .includes(partialAreaName.toLocaleLowerCase())
        );
      })
      .slice(0, 20);
  }
}
