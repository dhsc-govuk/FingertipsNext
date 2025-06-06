import { getMinAndMaxXAxisEntries } from './getMinAndMaxXAxisEntries';

describe('getMinAndMaxXAxisEntries', () => {
  const series = {
    type: 'line',
    data: [
      [2002, 2.5],
      [2004, 5],
      [2006, 8],
      [2008, 3],
      [2010, 2.5],
    ],
  };
  it('should get min and max X Axis entries', () => {
    const seriesData = [series] as Highcharts.SeriesOptionsType[];

    const expectedResult = { minXAxisEntries: 2002, maxXAxisEntries: 2010 };
    expect(getMinAndMaxXAxisEntries(seriesData)).toEqual(expectedResult);
  });

  it('should filter out non-line options', () => {
    const seriesData = [
      series,
      {
        type: 'line',
        data: [
          [2012, 3],
          [2014, 7],
          [2016, 8],
        ],
      },
      {
        type: 'bar',
        data: [
          [2020, 5],
          [2023, 6],
          [2025, 8],
        ],
      },
    ] as Highcharts.SeriesOptionsType[];

    const expectedResult = { minXAxisEntries: 2002, maxXAxisEntries: 2016 };
    expect(getMinAndMaxXAxisEntries(seriesData)).toEqual(expectedResult);
  });
});
