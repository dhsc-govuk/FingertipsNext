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

  it('should return "Financial multi-year, cumulative quarters" when periodType is FinancialMultiYear and collectionFrequency is Quarterly', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.FinancialMultiYear,
      Frequency.Quarterly
    );

    expect(periodLabelText).toEqual(
      'Financial multi-year, cumulative quarters'
    );
  });

  it('should return "" when the periodType and collectionFrequency combination is not mapped', () => {
    const periodLabelText = getPeriodLabel(
      PeriodType.Unknown,
      Frequency.Quarterly
    );

    expect(periodLabelText).toEqual('');
  });
});

describe('getAdditionalPeriodLabel', () => {
  it('should return the correct label for PeriodType.Yearly with a valid date', () => {
    const label = getAdditionalPeriodLabel({
      type: PeriodType.Yearly,
      from: new Date('2023-11-01'),
      to: new Date('2024-11-01'),
    });

    expect(label).toEqual('(month to month e.g. November to November) ');
  });

  it('should return an empty string when periodType is not Yearly', () => {
    const label = getAdditionalPeriodLabel({
      type: PeriodType.Calendar,
      from: new Date('2022-01-01'),
      to: new Date('2022-01-01'),
    });

    expect(label).toEqual('');
  });
});

describe('formatDatePointLabel', () => {
  describe('when reportingPeriod matches frequency and represents a single data point', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2023-01-01'),
          to: new Date('2023-01-01'),
        },
        Frequency.Annually,
        true
      );
      expect(datePointLabel).toEqual('2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2023-01-01'),
          to: new Date('2023-03-31'),
        },
        Frequency.Quarterly,
        true
      );
      expect(datePointLabel).toEqual('Jan - Mar 2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2023-04-01'),
          to: new Date('2023-04-30'),
        },
        Frequency.Monthly,
        true
      );
      expect(datePointLabel).toEqual('Apr 2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly (Leap year)', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2024-02-01'),
          to: new Date('2024-02-29'),
        },
        Frequency.Monthly,
        true
      );
      expect(datePointLabel).toEqual('Feb 2024');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Academic,
          from: new Date('2023-09-01'),
          to: new Date('2023-09-01'),
        },
        Frequency.Annually,
        true
      );
      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Yearly,
          from: new Date('2023-11-01'),
          to: new Date('2024-10-31'),
        },
        Frequency.Annually,
        true
      );
      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Financial,
          from: new Date('2023-04-01'),
          to: new Date('2023-04-01'),
        },
        Frequency.Annually,
        true
      );
      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Financial,
          from: new Date('2022-04-01'),
          to: new Date('2022-06-30'),
        },
        Frequency.Quarterly,
        true
      );
      expect(datePointLabel).toEqual('Apr to Jun 2022');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Financial,
          from: new Date('2023-04-01'),
          to: new Date('2023-04-30'),
        },
        Frequency.Monthly,
        true
      );
      expect(datePointLabel).toEqual('Apr 2023');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.FinancialYearEndPoint,
          from: new Date('2023-03-31'),
          to: new Date('2023-03-31'),
        },
        Frequency.Annually,
        true
      );
      expect(datePointLabel).toEqual('31 Mar 2022/23');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.FinancialMultiYear,
          from: new Date('2022-04-01'),
          to: new Date('2022-06-30'),
        },
        Frequency.Quarterly,
        true
      );
      expect(datePointLabel).toEqual('Apr 2022 to Jun 2022');
    });

    it('should return "X" when periodType and collectionFrequency combination is not mapped', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.FinancialMultiYear,
          from: new Date('2022-04-01'),
          to: new Date('2022-06-30'),
        },
        Frequency.Annually,
        true
      );
      expect(datePointLabel).toEqual('X');
    });
  });

  describe('when reportingPeriod does not match the frequency and reporting period represents multiple data points collated', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2023-01-01'),
          to: new Date('2025-01-01'),
        },
        Frequency.Annually,
        false
      );
      expect(datePointLabel).toEqual('2023 to 2025');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2023-01-01'),
          to: new Date('2024-12-01'),
        },
        Frequency.Quarterly,
        false
      );
      expect(datePointLabel).toEqual('Jan 2023 - Dec 2024');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2023-04-01'),
          to: new Date('2025-03-01'),
        },
        Frequency.Monthly,
        false
      );
      expect(datePointLabel).toEqual('Apr 2023 to Mar 2025');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Monthly (Leap year)', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Calendar,
          from: new Date('2024-02-01'),
          to: new Date('2026-01-01'),
        },
        Frequency.Monthly,
        false
      );
      expect(datePointLabel).toEqual('Feb 2024 to Jan 2026');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Academic,
          from: new Date('2023-09-01'),
          to: new Date('2025-09-01'),
        },
        Frequency.Annually,
        false
      );
      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Yearly,
          from: new Date('2023-11-01'),
          to: new Date('2025-10-31'),
        },
        Frequency.Annually,
        false
      );
      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Financial,
          from: new Date('2023-04-01'),
          to: new Date('2025-04-01'),
        },
        Frequency.Annually,
        false
      );
      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Quarterly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Financial,
          from: new Date('2022-04-01'),
          to: new Date('2024-03-01'),
        },
        Frequency.Quarterly,
        false
      );
      expect(datePointLabel).toEqual('Apr 2022 to Mar 2024');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Monthly', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.Financial,
          from: new Date('2023-04-01'),
          to: new Date('2025-03-01'),
        },
        Frequency.Monthly,
        false
      );
      expect(datePointLabel).toEqual('Apr 2023 to Mar 2025');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.FinancialYearEndPoint,
          from: new Date('2023-03-31'),
          to: new Date('2025-03-31'),
        },
        Frequency.Annually,
        false
      );
      expect(datePointLabel).toEqual('31 Mar 2022/23 to 31 Mar 2025/26');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.FinancialMultiYear,
          from: new Date('2022-04-01'),
          to: new Date('2024-06-30'),
        },
        Frequency.Quarterly,
        false
      );
      expect(datePointLabel).toEqual('');
    });

    it('should return "X" when periodType and collectionFrequency combination is not mapped', () => {
      const datePointLabel = formatDatePointLabel(
        {
          type: PeriodType.FinancialMultiYear,
          from: new Date('2022-04-01'),
          to: new Date('2024-06-30'),
        },
        Frequency.Annually,
        false
      );
      expect(datePointLabel).toEqual('X');
    });
  });
});
