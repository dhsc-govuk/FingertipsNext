import { isWithinOneMonth } from './dateComparison';

describe('should return true if indicator date is within one month of server date', () => {
  interface TestData {
    title: string;
    indicatorDate: Date;
    serverDate: Date;
    expectedResult: boolean;
  }

  it.each<TestData>([
    {
      title: '14 days',
      indicatorDate: new Date(2024, 6, 1),
      serverDate: new Date(2024, 6, 15),
      expectedResult: true,
    },
    {
      title: 'same day, 1 month',
      indicatorDate: new Date(2024, 5, 1),
      serverDate: new Date(2024, 6, 1),
      expectedResult: true,
    },
    {
      title: 'same day, 2 months',
      indicatorDate: new Date(2024, 4, 1),
      serverDate: new Date(2024, 6, 1),
      expectedResult: false,
    },
    {
      title: 'non leap year, end of jan to start of march',
      indicatorDate: new Date(2023, 0, 31),
      serverDate: new Date(2023, 2, 1),
      expectedResult: false,
    },
    {
      title: 'non leap year, start of feb to start of march',
      indicatorDate: new Date(2023, 1, 1),
      serverDate: new Date(2023, 2, 1),
      expectedResult: true,
    },
    {
      title: 'leap year, end of jan to start of march',
      indicatorDate: new Date(2024, 0, 31),
      serverDate: new Date(2024, 2, 1),
      expectedResult: false,
    },
    {
      title: 'leap year, start of feb to start of march',
      indicatorDate: new Date(2023, 1, 1),
      serverDate: new Date(2023, 2, 1),
      expectedResult: true,
    },
    {
      title: 'year boundary',
      indicatorDate: new Date(2024, 11, 31),
      serverDate: new Date(2025, 0, 1),
      expectedResult: true,
    },
  ])('$title', ({ serverDate, indicatorDate, expectedResult }) => {
    expect(isWithinOneMonth(serverDate, indicatorDate)).toBe(expectedResult);
  });
});
