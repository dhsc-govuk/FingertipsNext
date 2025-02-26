import { IndicatorDocumentServiceMock } from './indicatorDocumentServiceMock';
import { IIndicatorDocumentService, IndicatorDocument } from './searchTypes';

describe('IndicatorDocumentServiceMock', () => {
  const mockData: IndicatorDocument[] = [
    {
      indicatorID: '1',
      indicatorName: 'Red faced',
      indicatorDefinition:
        'Count of people who did something they are embarrassed by',
      latestDataPeriod: '2023',
      dataSource: 'The Beano',
      lastUpdatedDate: new Date('December 6, 2024'),
      associatedAreaCodes: ['Area1'],
      unitLabel: '',
    },
    {
      indicatorID: '2',
      indicatorName: 'Perp count',
      indicatorDefinition: 'Perps brought to justice by Red Angel',
      latestDataPeriod: '2022',
      dataSource: 'Mega City 1',
      lastUpdatedDate: new Date('November 5, 2023'),
      associatedAreaCodes: ['Area1', 'Area2'],
      unitLabel: '',
    },
  ];
  let indicatorDocumentMock: IIndicatorDocumentService;
  beforeAll(() => {
    indicatorDocumentMock = new IndicatorDocumentServiceMock(mockData);
  });

  it('should be successfully instantiated', async () => {
    expect(indicatorDocumentMock).toBeInstanceOf(IndicatorDocumentServiceMock);
  });

  it('should return the document corresponding to a given documentId', async () => {
    expect(await indicatorDocumentMock.getIndicator('2')).toEqual(mockData[1]);
  });

  it('should return nothing if given an invalid document id', async () => {
    expect(
      await indicatorDocumentMock.getIndicator('invalid id')
    ).toBeUndefined();
  });
});
