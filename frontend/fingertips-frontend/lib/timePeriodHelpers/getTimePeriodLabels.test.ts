import { Frequency, PeriodType } from '@/generated-sources/ft-api-client';
import {
  getPeriodLabel,
  formatDatePointLabel,
  getAdditionalPeriodLabel,
} from './getTimePeriodLabels';

describe('periodLabelText', () => {
  it('should return "" when periodType is Calendar and collectionFrequency is Annually', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Calendar,
      Frequency.Annually
    );

    expect(periodLabelText).toEqual('');
  });

  it('should return "Quarterly" when periodType is Calendar and collectionFrequency is Quarterly', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Calendar,
      Frequency.Quarterly
    );

    expect(periodLabelText).toEqual('Quarterly');
  });

  it('should return "Monthly" when periodType is Calendar and collectionFrequency is Monthly', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Calendar,
      Frequency.Monthly
    );

    expect(periodLabelText).toEqual('Monthly');
  });

  it('should return "Academic year" when periodType is Academic and collectionFrequency is Annually', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Academic,
      Frequency.Annually
    );

    expect(periodLabelText).toEqual('Academic year');
  });

  it('should return "Yearly" using the from and to dates when periodType is Yearly and collectionFrequency is Annually', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Yearly,
      Frequency.Annually
    );

    expect(periodLabelText).toEqual('Yearly');
  });

  it('should return "Financial year" when periodType is Financial and collectionFrequency is Annually', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Financial,
      Frequency.Annually
    );

    expect(periodLabelText).toEqual('Financial year');
  });

  it('should return "Financial year, Quarterly" when periodType is Financial and collectionFrequency is Quarterly', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Financial,
      Frequency.Quarterly
    );

    expect(periodLabelText).toEqual('Financial year, Quarterly');
  });

  it('should return "Monthly" when periodType is Financial and collectionFrequency is Monthly', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Financial,
      Frequency.Monthly
    );

    expect(periodLabelText).toEqual('Monthly');
  });

  it('should return "Financial year end point" when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.FinancialYearEndPoint,
      Frequency.Annually
    );

    expect(periodLabelText).toEqual('Financial year end point');
  });

  it('should return "Financial multi-year, cumulative quarters" when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.FinancialMultiYear,
      Frequency.Quarterly
    );

    expect(periodLabelText).toEqual(
      'Financial multi-year, cumulative quarters'
    );
  });

  it('should return "" when periodType and collectionFrequency is combination is not mapped', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Unknown,
      Frequency.Quarterly
    );

    expect(periodLabelText).toEqual('');
  });
});

describe('getAdditionalPeriodLabel', () => {
  it('should return the correct label for PeriodType.Yearly with a valid date', () => {
    const date = new Date('2023-11-01').getTime();

    const label = getAdditionalPeriodLabel(PeriodType.Yearly, date);

    expect(label).toEqual('(month to month e.g. November to November) ');
  });

  it('should return an empty string for PeriodType.Yearly with undefined date', () => {
    const label = getAdditionalPeriodLabel(PeriodType.Yearly, undefined);

    expect(label).toEqual('');
  });

  it('should return an empty string for non-Yearly period types', () => {
    const date = new Date('2023-11-01').getTime();

    const label = getAdditionalPeriodLabel(PeriodType.Calendar, date);

    expect(label).toEqual('');
  });

  it('should return an empty string for non-Yearly period types and undefined date', () => {
    const label = getAdditionalPeriodLabel(PeriodType.Calendar, undefined);

    expect(label).toEqual('');
  });
});

describe('formatDatePointLabel', () => {
  describe('when reportingPeriod is 1', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-01-01').getTime(),
        Frequency.Annually,
        1
      );

      expect(datePointLabel).toEqual('2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-01-01').getTime(),
        Frequency.Quarterly,
        1
      );

      expect(datePointLabel).toEqual('Jan - Mar 2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-04-01').getTime(),
        Frequency.Monthly,
        1
      );

      expect(datePointLabel).toEqual('Apr 2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly (Leap year)', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2024-02-01').getTime(),
        Frequency.Monthly,
        1
      );

      expect(datePointLabel).toEqual('Feb 2024');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Academic,
        new Date('2023-09-01').getTime(),
        Frequency.Annually,
        1
      );

      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Yearly,
        new Date('2023-11-01').getTime(),
        Frequency.Annually,
        1
      );

      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2023-04-01').getTime(),
        Frequency.Annually,
        1
      );

      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2022-04-01').getTime(),
        Frequency.Quarterly,
        1
      );

      expect(datePointLabel).toEqual('Apr to Jun 2022');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2023-04-01').getTime(),
        Frequency.Monthly,
        1
      );

      expect(datePointLabel).toEqual('Apr 2023');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialYearEndPoint,
        new Date('2023-03-31').getTime(),
        Frequency.Annually,
        1
      );

      expect(datePointLabel).toEqual('31 Mar 2022/23');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialMultiYear,
        new Date('2022-04-01').getTime(),
        Frequency.Quarterly,
        1
      );

      expect(datePointLabel).toEqual('Apr 2022 to Jun 2022');
    });

    it('should return "X" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialMultiYear,
        new Date('2022-04-01').getTime(),
        Frequency.Annually,
        1
      );

      expect(datePointLabel).toEqual('X');
    });
  });

  describe('when reportingPeriod is 3', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-01-01').getTime(),
        Frequency.Annually,
        3
      );

      expect(datePointLabel).toEqual('2023 to 2025');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-01-01').getTime(),
        Frequency.Quarterly,
        3
      );

      expect(datePointLabel).toEqual('Jan 2023 - Dec 2024');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-04-01').getTime(),
        Frequency.Monthly,
        3
      );

      expect(datePointLabel).toEqual('Apr 2023 to Mar 2025');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly (Leap year)', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2024-02-01').getTime(),
        Frequency.Monthly,
        3
      );

      expect(datePointLabel).toEqual('Feb 2024 to Jan 2026');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Academic,
        new Date('2023-09-01').getTime(),
        Frequency.Annually,
        3
      );

      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Yearly,
        new Date('2023-11-01').getTime(),
        Frequency.Annually,
        3
      );

      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2023-04-01').getTime(),
        Frequency.Annually,
        3
      );

      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2022-04-01').getTime(),
        Frequency.Quarterly,
        3
      );

      expect(datePointLabel).toEqual('Apr 2022 to Mar 2024');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2023-04-01').getTime(),
        Frequency.Monthly,
        3
      );

      expect(datePointLabel).toEqual('Apr 2023 to Mar 2025');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialYearEndPoint,
        new Date('2023-03-31').getTime(),
        Frequency.Annually,
        3
      );

      expect(datePointLabel).toEqual('31 Mar 2022/23 to 31 Mar 2024/25');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialMultiYear,
        new Date('2022-04-01').getTime(),
        Frequency.Quarterly,
        3
      );

      expect(datePointLabel).toEqual('');
    });

    it('should return "X" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialMultiYear,
        new Date('2022-04-01').getTime(),
        Frequency.Annually,
        3
      );

      expect(datePointLabel).toEqual('X');
    });
  });

  describe('when reportingPeriod is 5', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-01-01').getTime(),
        Frequency.Annually,
        5
      );

      expect(datePointLabel).toEqual('2023 to 2027');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-01-01').getTime(),
        Frequency.Quarterly,
        5
      );

      expect(datePointLabel).toEqual('Jan 2023 - Dec 2026');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2023-04-01').getTime(),
        Frequency.Monthly,
        5
      );

      expect(datePointLabel).toEqual('Apr 2023 to Mar 2027');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly (Leap year)', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Calendar,
        new Date('2024-02-01').getTime(),
        Frequency.Monthly,
        5
      );

      expect(datePointLabel).toEqual('Feb 2024 to Jan 2028');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Academic,
        new Date('2023-09-01').getTime(),
        Frequency.Annually,
        5
      );

      expect(datePointLabel).toEqual('2023/24 to 2027/28');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Yearly,
        new Date('2023-11-01').getTime(),
        Frequency.Annually,
        5
      );

      expect(datePointLabel).toEqual('2023/24 to 2027/28');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2023-04-01').getTime(),
        Frequency.Annually,
        5
      );

      expect(datePointLabel).toEqual('2023/24 to 2027/28');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2022-04-01').getTime(),
        Frequency.Quarterly,
        5
      );

      expect(datePointLabel).toEqual('Apr 2022 to Mar 2026');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.Financial,
        new Date('2023-04-01').getTime(),
        Frequency.Monthly,
        5
      );

      expect(datePointLabel).toEqual('Apr 2023 to Mar 2027');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialYearEndPoint,
        new Date('2023-03-31').getTime(),
        Frequency.Annually,
        5
      );

      expect(datePointLabel).toEqual('31 Mar 2022/23 to 31 Mar 2026/27');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialMultiYear,
        new Date('2022-04-01').getTime(),
        Frequency.Quarterly,
        5
      );

      expect(datePointLabel).toEqual('');
    });

    it('should return "X" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePointLabel = formatDatePointLabel(
        PeriodType.FinancialMultiYear,
        new Date('2022-04-01').getTime(),
        Frequency.Annually,
        5
      );

      expect(datePointLabel).toEqual('X');
    });
  });
});
