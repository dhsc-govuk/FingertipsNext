import { IIndicatorSearchClient, IndicatorSearchResult } from './searchTypes';

export const MOCK_DATA: IndicatorSearchResult[] = [
  {
    indicatorId: '1',
    indicatorName: 'NHS',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdated: new Date('December 6, 2024'),
  },
  {
    indicatorId: '2',
    indicatorName: 'DHSC',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdated: new Date('November 5, 2023'),
  },
];

export class IndicatorSearchServiceMock implements IIndicatorSearchClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchWith(indicator: string): Promise<IndicatorSearchResult[]> {
    return Promise.resolve(MOCK_DATA);
  }
}
