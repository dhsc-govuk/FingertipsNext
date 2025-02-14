import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import { IIndicatorSearchService, IndicatorDocument } from './searchTypes';

describe('IndicatorSearchServiceMock', () => {
  const mockData: IndicatorDocument[] = [
    {
      indicatorId: '1',
      name: 'Red faced',
      definition: 'Count of people who did something they are embarrassed by',
      latestDataPeriod: '2023',
      dataSource: 'The Beano',
      lastUpdated: new Date('December 6, 2024'),
    },
    {
      indicatorId: '2',
      name: 'Perp count',
      definition: 'Perps brought to justice',
      latestDataPeriod: '2022',
      dataSource: 'Mega City 1',
      lastUpdated: new Date('November 5, 2023'),
    },
  ];
  let indicatorSearchMock: IIndicatorSearchService;
  beforeAll(() => {
    indicatorSearchMock = new IndicatorSearchServiceMock(mockData);
  });

  it('should be successfully instantiated', async () => {
    expect(indicatorSearchMock).toBeInstanceOf(IndicatorSearchServiceMock);
  });

  it('should perform a search operation on name', async () => {
    expect(await indicatorSearchMock.searchWith('Red')).toEqual([mockData[0]]);
  });

  it('should perform a search operation on definition', async () => {
    expect(await indicatorSearchMock.searchWith('justice')).toEqual([
      mockData[1],
    ]);
  });
});
