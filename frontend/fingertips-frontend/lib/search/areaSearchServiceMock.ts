import {
  IAreaSearchService,
  AreaDocument,
  SuggestionResult,
  highlightTag,
} from './searchTypes';
import { ErrorIdPrefix } from '@/mock/ErrorTriggeringIds';

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
  ): Promise<SuggestionResult[]> {
    if (partialAreaName.startsWith(ErrorIdPrefix)) {
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
      .map((mockArea) => ({
        text: `${highlightTag}${partialAreaName}${highlightTag}`,
        document: {
          areaCode: mockArea.areaCode,
          areaName: mockArea.areaName,
          areaType: mockArea.areaType,
          postcode: mockArea.postcode,
        },
      }))
      .slice(0, 20);
  }
}
