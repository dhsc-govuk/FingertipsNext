import { SearchService } from './searchService';

export interface IndicatorSearchResult {
  id: string;
  indicatorName: string;
  latestDataPeriod?: string;
  dataSource?: string;
  lastUpdated?: string;
}

export interface IndicatorSearch {
  searchByIndicator(indicator: string): Promise<IndicatorSearchResult[]>;
}

export const MOCK_DATA: IndicatorSearchResult[] = [
  {
    id: '1',
    indicatorName: 'NHS',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdated: formatDate(new Date('December 6, 2024')),
  },
  {
    id: '2',
    indicatorName: 'DHSC',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdated: formatDate(new Date('November 5, 2023')),
  },
];

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

let searchService: SearchService;
try {
  searchService = new SearchService();
} catch {
  // Handle error
}

export const getSearchService = (): IndicatorSearch => {
  return searchService
    ? searchService
    : {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        searchByIndicator(indicator: string): Promise<IndicatorSearchResult[]> {
          return Promise.resolve(MOCK_DATA);
        },
      };
};
