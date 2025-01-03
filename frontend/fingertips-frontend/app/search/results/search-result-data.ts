export interface IndicatorSearchResult {
  id: number;
  indicatorName: string;
  latestDataPeriod: string;
  dataSource: string;
  lastUpdated: string;
}

export const MOCK_DATA: IndicatorSearchResult[] = [
  {
    id: 1,
    indicatorName: 'NHS',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdated: formatDate(new Date('December 6, 2024')),
  },
  {
    id: 2,
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

export const getSearchData = (): IndicatorSearchResult[] => {
  return MOCK_DATA;
};
