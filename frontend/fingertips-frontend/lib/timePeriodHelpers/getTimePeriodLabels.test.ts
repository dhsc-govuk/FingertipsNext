import {
  DatePeriod,
  Frequency,
  getTimePeriodLabels,
  PeriodType,
} from './getTimePeriodLabels';

describe('getTimePeriodLabels', () => {
  describe('periodLabelText', () => {
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
        from: new Date('2022-09-01'),
        to: new Date('2023-08-31'),
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
      Frequency.Annual,
      1
    );

    expect(periodLabelText).toEqual('');
  });
});
