import Highcharts from 'highcharts';

export const getMinAndMaxXAxisEntries = (
  series: Highcharts.SeriesOptionsType[]
): { minXAxisEntries: number; maxXAxisEntries: number } => {
  const allXAxisEntries = series
    .filter(({ type }) => type === 'line')
    .flatMap((seriesData) => {
      const { data } = seriesData as Highcharts.SeriesLineOptions;
      if (!data) return [];
      return data.map((values) => (values as number[])[0]);
    });

  return {
    minXAxisEntries: Math.min(...allXAxisEntries),
    maxXAxisEntries: Math.max(...allXAxisEntries),
  };
};
