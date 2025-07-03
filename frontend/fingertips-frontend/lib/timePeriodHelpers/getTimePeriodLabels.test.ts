import {
  DatePeriod,
  Frequency,
  getTimePeriodLabels,
  PeriodType,
} from './getTimePeriodLabels';

describe('getTimePeriodLabels', () => {
  describe('periodLabelText', () => {
    it('should return "" when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-04-01'),
        to: new Date('2023-06-30'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(periodLabelText).toEqual('');
    });

    it('should return "Quarterly" when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-04-01'),
        to: new Date('2023-06-30'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        1
      );

      expect(periodLabelText).toEqual('Quarterly');
    });

    it('should return "Academic year" when periodType is Academic and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Academic,
        from: new Date('2023-09-01'),
        to: new Date('2024-08-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(periodLabelText).toEqual('Academic year');
    });

    it('should return "Yearly" using the from and to dates when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Yearly,
        from: new Date('2023-11-01'),
        to: new Date('2023-10-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(periodLabelText).toEqual(
        'Yearly (month to month e.g. November to October)'
      );
    });

    it('should return "Financial year" when periodType is Financial and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(periodLabelText).toEqual('Financial year');
    });

    it('should return "Monthly" when collectionFrequency is Monthly regardless of periodType', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2022-04-01'),
        to: new Date('2022-03-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Monthly,
        1
      );

      expect(periodLabelText).toEqual('Monthly');
    });

    it('should return "Financial year end point" when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(periodLabelText).toEqual('Financial year end point');
    });

    it('should return "Financial year, Quarterly" when periodType is FinancialYearEndPoint and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        1
      );

      expect(periodLabelText).toEqual('Financial year, Quarterly');
    });

    it('should return "Financial multi-year, cumulative quarters" when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.CumulativeQuarters,
        1
      );

      expect(periodLabelText).toEqual(
        'Financial multi-year, cumulative quarters'
      );
    });

    it('should return "" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { periodLabelText } = getTimePeriodLabels(
        datePeriod,
        Frequency.CumulativeQuarters,
        1
      );

      expect(periodLabelText).toEqual('');
    });
  });

  describe('when reportingPeriod is 1', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-01-01'),
        to: new Date('2023-12-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(datePointLabel).toEqual('2023');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-01-01'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        1
      );

      expect(datePointLabel).toEqual('Jan - Mar 2023');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Academic,
        from: new Date('2023-09-01'),
        to: new Date('2024-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Yearly,
        from: new Date('2023-11-01'),
        to: new Date('2024-10-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2023-04-01'),
        to: new Date('2024-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(datePointLabel).toEqual('2023/24');
    });

    it('should return the correct datePointLabel when collectionFrequency is Monthly regardless of periodType', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2022-08-01'),
        to: new Date('2022-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Monthly,
        1
      );

      expect(datePointLabel).toEqual('Aug 2022');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2023-03-31'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(datePointLabel).toEqual('31 Mar 2022/23');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2022-04-01'),
        to: new Date('2022-06-30'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        1
      );

      expect(datePointLabel).toEqual('Apr to Jun 2022');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.CumulativeQuarters,
        1
      );

      expect(datePointLabel).toEqual('Apr 2022 to Aug 2023');
    });

    it('should return "X" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        1
      );

      expect(datePointLabel).toEqual('X');
    });
  });

  describe('when reportingPeriod is 3', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-01-01'),
        to: new Date('2023-12-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        3
      );

      expect(datePointLabel).toEqual('2023 to 2025');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-01-01'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        3
      );

      expect(datePointLabel).toEqual('Jan 2023 - Dec 2025');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Academic,
        from: new Date('2023-09-01'),
        to: new Date('2024-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        3
      );

      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Yearly,
        from: new Date('2023-11-01'),
        to: new Date('2024-10-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        3
      );

      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2023-04-01'),
        to: new Date('2024-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        3
      );

      expect(datePointLabel).toEqual('2023/24 to 2025/26');
    });

    it('should return the correct datePointLabel when collectionFrequency is Monthly regardless of periodType', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2022-08-01'),
        to: new Date('2022-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Monthly,
        3
      );

      expect(datePointLabel).toEqual('Aug 2022 to Jul 2024');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2023-03-31'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        3
      );

      expect(datePointLabel).toEqual('31 Mar 2022/23 to 31 Mar 2024/25');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2022-04-01'),
        to: new Date('2022-06-30'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        3
      );

      expect(datePointLabel).toEqual('Apr 2022 to Mar 2024');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.CumulativeQuarters,
        3
      );

      expect(datePointLabel).toEqual('');
    });

    it('should return "X" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        3
      );

      expect(datePointLabel).toEqual('X');
    });
  });

  describe('when reportingPeriod is 5', () => {
    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-01-01'),
        to: new Date('2023-12-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        5
      );

      expect(datePointLabel).toEqual('2023 to 2027');
    });

    it('should return the correct datePointLabel when periodType is Calendar and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Calendar,
        from: new Date('2023-01-01'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        5
      );

      expect(datePointLabel).toEqual('Jan 2023 - Dec 2027');
    });

    it('should return the correct datePointLabel when periodType is Academic and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Academic,
        from: new Date('2023-09-01'),
        to: new Date('2024-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        5
      );

      expect(datePointLabel).toEqual('2023/24 to 2027/28');
    });

    it('should return the correct datePointLabel when periodType is Yearly and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Yearly,
        from: new Date('2023-11-01'),
        to: new Date('2024-10-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        5
      );

      expect(datePointLabel).toEqual('2023/24 to 2027/28');
    });

    it('should return the correct datePointLabel when periodType is Financial and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2023-04-01'),
        to: new Date('2024-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        5
      );

      expect(datePointLabel).toEqual('2023/24 to 2027/28');
    });

    it('should return the correct datePointLabel when collectionFrequency is Monthly regardless of periodType', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.Financial,
        from: new Date('2022-08-01'),
        to: new Date('2022-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Monthly,
        5
      );

      expect(datePointLabel).toEqual('Aug 2022 to Jul 2026');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Annually', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2023-03-31'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        5
      );

      expect(datePointLabel).toEqual('31 Mar 2022/23 to 31 Mar 2026/27');
    });

    it('should return the correct datePointLabel when periodType is FinancialYearEndPoint and collectionFrequency is Quarterly', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialYearEndPoint,
        from: new Date('2022-04-01'),
        to: new Date('2022-06-30'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Quarterly,
        5
      );

      expect(datePointLabel).toEqual('Apr 2022 to Mar 2026');
    });

    it('should return the correct datePointLabel when periodType is FinancialMultiYear and collectionFrequency is Cumulative quarters', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-08-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.CumulativeQuarters,
        5
      );

      expect(datePointLabel).toEqual('');
    });

    it('should return "X" when periodType and collectionFrequency is combination is not mapped', () => {
      const datePeriod: DatePeriod = {
        type: PeriodType.FinancialMultiYear,
        from: new Date('2022-04-01'),
        to: new Date('2023-03-31'),
      };

      const { datePointLabel } = getTimePeriodLabels(
        datePeriod,
        Frequency.Annual,
        5
      );

      expect(datePointLabel).toEqual('X');
    });
  });
});
