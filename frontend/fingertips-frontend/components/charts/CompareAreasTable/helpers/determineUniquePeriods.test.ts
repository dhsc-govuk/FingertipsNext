import { PeriodType } from '@/generated-sources/ft-api-client';
import { determineUniquePeriods } from './determineUniquePeriods';

describe('determineUniquePeriods', () => {
  it('should return unique periods from an array of DatePeriod objects', () => {
    const periodA = {
      type: PeriodType.Calendar,
      from: new Date('2022-01-01'),
      to: new Date('2023-12-31'),
    };
    const periodB = {
      type: PeriodType.Calendar,
      from: new Date('2022-01-01'),
      to: new Date('2023-12-31'),
    };
    const periodC = {
      type: PeriodType.Calendar,
      from: new Date('2023-01-01'),
      to: new Date('2024-12-31'),
    };

    const uniquePeriods = determineUniquePeriods([periodA, periodB, periodC]);

    expect(uniquePeriods).toHaveLength(2);
    expect(uniquePeriods).toEqual(
      expect.arrayContaining([
        {
          type: PeriodType.Calendar,
          from: new Date('2022-01-01'),
          to: new Date('2023-12-31'),
        },
        {
          type: PeriodType.Calendar,
          from: new Date('2023-01-01'),
          to: new Date('2024-12-31'),
        },
      ])
    );
  });

  it('should return an empty array when input is empty', () => {
    const uniquePeriods = determineUniquePeriods([]);
    expect(uniquePeriods).toEqual([]);
  });
});
