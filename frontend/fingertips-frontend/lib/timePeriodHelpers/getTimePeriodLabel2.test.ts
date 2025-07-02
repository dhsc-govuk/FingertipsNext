import { getTimePeriodLabels } from './getTimePeriodLabel2';
import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';

describe('getTimePeriodLabels', () => {
  it('should return correct labels for Calendar period type', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Calendar,
      from: new Date('2023'),
      to: new Date('2024'),
    };

    const result = getTimePeriodLabels(datePeriod, Frequency.Annual, 3);

    expect(result).toEqual({
      periodLabel: 'Calendar year',
      datePointLabel: '2023',
      timeRangeLabel: '2023 - 2026',
    });
  });

  it('should return correct labels for Academic period type', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Academic,
      from: new Date('2022-09-01'),
      to: new Date('2023-08-31'),
    };

    const result = getTimePeriodLabels(datePeriod, Frequency.Annual, 3);

    expect(result).toEqual({
      periodLabel: 'Academic year',
      datePointLabel: '2022/23',
      timeRangeLabel: '2022/23 - 2025/26',
    });
  });

  it('should return correct labels for Financial/Annual period type', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Financial,
      from: new Date('2022-04-01'),
      to: new Date('2023-03-31'),
    };

    const result = getTimePeriodLabels(datePeriod, Frequency.Annual, 3);

    expect(result).toEqual({
      periodLabel: 'Financial year',
      datePointLabel: '2022/23',
      timeRangeLabel: '2022/23 - 2025/26',
    });
  });

  it('should return correct labels for Financial/monthly period type before cut off date 01/04', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Financial,
      from: new Date('2022-02-01'),
      to: new Date('2022-03-01'),
    };

    const result = getTimePeriodLabels(datePeriod, Frequency.Monthly, 3);

    expect(result).toEqual({
      periodLabel: 'Monthly',
      datePointLabel: 'Feb 2021',
      timeRangeLabel: 'Feb 2021/22 - Jan 2024/25',
    });
  });


  it('should return "X" labels for unknown period type', () => {
    const datePeriod: DatePeriod = {
      type: 'Unknown' as PeriodType,
      from: new Date('2020'),
      to: new Date('2021'),
    };

    const result = getTimePeriodLabels(datePeriod, Frequency.Annual, 1);

    expect(result).toEqual({
      periodLabel: 'X',
      datePointLabel: 'X',
      timeRangeLabel: 'X',
    });
  });
});
