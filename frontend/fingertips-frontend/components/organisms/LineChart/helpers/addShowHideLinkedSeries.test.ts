import { SeriesOptionsType } from 'highcharts';
import { mockIndicatorData } from '../mocks';
import { Dispatch, SetStateAction } from 'react';
import { generateSeriesData } from './generateSeriesData';
import { addShowHideLinkedSeries } from './addShowHideLinkedSeries';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

describe('addShowHideLinkedSeries', () => {
  let generatedSeriesData: SeriesOptionsType[];
  let setVisibility: Dispatch<SetStateAction<Record<string, boolean>>>;
  const mockXCategoryKeys = mockIndicatorData[0].healthData.map(point => convertDateToNumber(point.datePeriod?.from))

  beforeEach(() => {
    generatedSeriesData = generateSeriesData(
      mockXCategoryKeys,
      [mockIndicatorData[0]],
      undefined,
      undefined,
      true
    );

    setVisibility = vi.fn() as Dispatch<
      SetStateAction<Record<string, boolean>>
    >;
  });

  it('should add add show and hide functions which call setVisibility (state)', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      false,
      {},
      setVisibility
    );

    const [first] = generatedSeriesData;
    if ('events' in first) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      first.events.show({});
    }
    expect(setVisibility).toBeCalledTimes(1);
    expect(setVisibility).toBeCalledWith({ 'North FooBar': true });

    if ('events' in first) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      first.events.hide({});
    }
    expect(setVisibility).toBeCalledTimes(2);
    expect(setVisibility).toBeCalledWith({ 'North FooBar': false });
  });

  it('should set the initial visibility of linkedTo series to false', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      false,
      {},
      setVisibility
    );

    expect(generatedSeriesData[0]).not.toHaveProperty('visible');
    expect(generatedSeriesData[1]).toHaveProperty('visible', false);
  });

  it('should set the visibility of linkedTo series to false if true in state but showConfidenceIntervalsData is false', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      false,
      { 'North FooBar': true },
      setVisibility
    );

    expect(generatedSeriesData[0]).not.toHaveProperty('visible');
    expect(generatedSeriesData[1]).toHaveProperty('visible', false);
  });

  it('should set the visibility of linkedTo series to true if set in state and showConfidenceIntervalsData is true', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      true,
      { 'North FooBar': true },
      setVisibility
    );

    expect(generatedSeriesData[0]).not.toHaveProperty('visible');
    expect(generatedSeriesData[1]).toHaveProperty('visible', true);
  });
});
