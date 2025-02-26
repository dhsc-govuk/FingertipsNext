import { IIndicatorDocumentService, IndicatorDocument } from './searchTypes';

export class IndicatorDocumentServiceMock implements IIndicatorDocumentService {
  mockIndicatorData: IndicatorDocument[];

  constructor(indicatorData: IndicatorDocument[]) {
    this.mockIndicatorData = indicatorData;
  }

  public async getIndicator(indicatorId: string): Promise<IndicatorDocument> {
    return this.mockIndicatorData.filter((indicator) => {
      return indicator.indicatorID === indicatorId;
    })[0];
  }
}
