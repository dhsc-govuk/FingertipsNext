import { PopulationDataForArea } from '@/generated-sources/ft-api-client';

// source for mock data https://fingertips.phe.org.uk/api/quinary_population?area_code=E92000001&area_type_id=15
export const mockPopulationData: PopulationDataForArea = {
  areaCode: 'E92000001',
  areaName: '',
  year: 2023,
  indicatorId: 92708,
  indicatorName: '',
  populationData: [
    { ageBand: '0-4', totalFemale: 1496012, totalMale: 1568625 },
    { ageBand: '5-9', totalFemale: 1635842, totalMale: 1712925 },
    { ageBand: '10-14', totalFemale: 1721746, totalMale: 1807194 },
    { ageBand: '15-19', totalFemale: 1652231, totalMale: 1752832 },
    { ageBand: '20-24', totalFemale: 1692751, totalMale: 1763621 },
    { ageBand: '25-29', totalFemale: 1905676, totalMale: 1872173 },
    { ageBand: '30-34', totalFemale: 2065216, totalMale: 1948207 },
    { ageBand: '35-39', totalFemale: 2043718, totalMale: 1907182 },
    { ageBand: '40-44', totalFemale: 1942508, totalMale: 1840894 },
    { ageBand: '45-49', totalFemale: 1744723, totalMale: 1689551 },
    { ageBand: '50-54', totalFemale: 1936763, totalMale: 1872253 },
    { ageBand: '55-59', totalFemale: 1968410, totalMale: 1895440 },
    { ageBand: '60-64', totalFemale: 1768357, totalMale: 1702386 },
    { ageBand: '65-69', totalFemale: 1482260, totalMale: 1400611 },
    { ageBand: '70-74', totalFemale: 1357594, totalMale: 1232400 },
    { ageBand: '75-79', totalFemale: 1275145, totalMale: 1111980 },
    { ageBand: '80-84', totalFemale: 823120, totalMale: 653365 },
    { ageBand: '85-89', totalFemale: 547342, totalMale: 377979 },
    { ageBand: '90+', totalFemale: 347835, totalMale: 173456 },
  ],
};
