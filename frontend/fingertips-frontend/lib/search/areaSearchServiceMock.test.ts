import { AreaSearchServiceMock } from './areaSearchServiceMock';
import { AreaDocument, IAreaSearchService } from './searchTypes';

describe('AreaSearchServiceMock', () => {
  const mockData: AreaDocument[] = [
    {
      areaCode: '1234',
      areaType: 'seaSide',
      areaName: 'Poole',
    },
    {
      areaCode: '2345',
      areaType: 'town',
      areaName: 'Birmingham',
    },
    {
      areaCode: '5678',
      areaType: 'town',
      areaName: 'Leeds',
    },
  ];
  let areaSearchMock: IAreaSearchService;
  beforeAll(() => {
    areaSearchMock = new AreaSearchServiceMock(mockData);
  });

  it('should be successfully instantiated', async () => {
    expect(areaSearchMock).toBeInstanceOf(AreaSearchServiceMock);
  });

  it('should perform a search operation on areaName', async () => {
    expect(await areaSearchMock.getAreaSuggestions('Birm')).toEqual([
      { text: '*Birm*', document: mockData[1] },
    ]);
  });

  it('should perform a search operation on areaCode', async () => {
    expect(await areaSearchMock.getAreaSuggestions('1234')).toEqual([
      { text: '*1234*', document: mockData[0] },
    ]);
  });

  it('should be case agnostic', async () => {
    expect(await areaSearchMock.getAreaSuggestions('leeds')).toEqual([
      { text: '*leeds*', document: { ...mockData[2], postcode: undefined } },
    ]);
  });
});
