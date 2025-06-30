import { getTimePeriodLabels } from './getTimePeriodLabels';
import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';

describe('getTimePeriodLabels', () => {
  it('should return correct labels for Calendar period type', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Calendar,
      frequency: Frequency.Annual,
      from: new Date('2020'),
      to: new Date('2021'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Calendar year',
      datePointLabel: '2020',
      timeRangeLabel: '2020 - 2021',
    });
  });

  it('should return correct labels for Academic period type when after the cut off date 01/09', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Academic,
      frequency: Frequency.Annual,
      from: new Date('2022-10-01'),
      to: new Date('2023-09-30'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Academic year',
      datePointLabel: '2022/23',
      timeRangeLabel: '2022/23 - 2023/24',
    });
  });

  it('should return correct labels for Academic period type when before the cut off date 01/09', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Academic,
      frequency: Frequency.Annual,
      from: new Date('2022-06-01'),
      to: new Date('2023-05-31'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Academic year',
      datePointLabel: '2021/22',
      timeRangeLabel: '2021/22 - 2022/23',
    });
  });

  it('should return correct labels for Financial/Annual period type when after the cut off date 01/04', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Financial,
      frequency: Frequency.Annual,
      from: new Date('2022-10-01'),
      to: new Date('2023-09-30'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Financial year',
      datePointLabel: '2022/23',
      timeRangeLabel: '2022/23 - 2023/24',
    });
  });

  it('should return correct labels for Financial/Annual period type when before the cut off date 01/04', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Financial,
      frequency: Frequency.Annual,
      from: new Date('2022-02-01'),
      to: new Date('2023-01-31'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Financial year',
      datePointLabel: '2021/22',
      timeRangeLabel: '2021/22 - 2022/23',
    });
  });

  it('should return correct labels for Financial/monthly period type when after the cut off date 01/04', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Financial,
      frequency: Frequency.Monthly,
      from: new Date('2022-05-01'),
      to: new Date('2022-06-01'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Financial year, monthly',
      datePointLabel: 'May 2022/23',
      timeRangeLabel: 'May 2022/23 - Jun 2022/23',
    });
  });

  it('should return correct labels for Financial/monthly period type when before the cut off date 01/04', () => {
    const datePeriod: DatePeriod = {
      type: PeriodType.Financial,
      frequency: Frequency.Monthly,
      from: new Date('2022-03-01'),
      to: new Date('2022-04-01'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'Financial year, monthly',
      datePointLabel: 'Mar 2021/22',
      timeRangeLabel: 'Mar 2021/22 - Apr 2022/23',
    });
  });

  it('should return "X" labels for unknown period type', () => {
    const datePeriod: DatePeriod = {
      type: 'Unknown' as PeriodType,
      frequency: Frequency.Annual,
      from: new Date('2020'),
      to: new Date('2021'),
    };

    const result = getTimePeriodLabels(datePeriod);

    expect(result).toEqual({
      periodLabel: 'X',
      datePointLabel: 'X',
      timeRangeLabel: 'X',
    });
  });
});
