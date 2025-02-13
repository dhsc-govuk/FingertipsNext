import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SeriesErrorbarOptions, SymbolKeyValue } from 'highcharts';
import { showConfidenceIntervals } from '@/lib/chartHelpers/chartHelpers';
import { ChartColours } from '@/lib/chartHelpers/colours';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  chartColours: ChartColours[],
  benchmarkData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean,
): Highcharts.SeriesOptionsType[] {
  // const seriesData = data.map<Highcharts.SeriesOptionsType>((item, index) => ({
  //   type: 'line',
  //   name: `${item.areaName}`,
  //   data: item.healthData.map((point) => [point.year, point.value]),
  //   marker: {
  //     symbol: symbols[index % symbols.length],
  //   },
  // }));

  // if (benchmarkData) {
  //   const englandSeries: Highcharts.SeriesLineOptions = {
  //     type: 'line',
  //     name: `Benchmark: ${benchmarkData.areaName}`,
  //     data: benchmarkData.healthData.map((point) => [point.year, point.value]),
  //     color: 'black',
  //     marker: {
  //       symbol: 'circle',
  //     },
  //   };
  //   seriesData.unshift(englandSeries);
  // }

  // const ci = showConfidenceIntervals(data);
  //
  // if (showConfidenceIntervalsData) {
  //   seriesData.push(...ci);
  // }

  // const englandSeries: Highcharts.SeriesLineOptions[] = benchmarkData ? [{
  //   type: 'line',
  //   name: `Benchmark: ${benchmarkData.areaName}`,
  //   data: benchmarkData.healthData.map((point) => [point.year, point.value]),
  //   color: 'black',
  //   marker: {
  //     symbol: 'circle',
  //   },
  // }] : [];
  //
    const seriesData= data.flatMap((item, index) => {

      const lineSeries = 
        {
          type: 'line',
          name: `${item.areaName}`,
          data: item.healthData.map((point) => [point.year, point.value]),
          marker: {
            symbol: symbols[index % symbols.length],
          },
          color: chartColours[index % chartColours.length]
        };


      const confidenceIntervalSeries =  {
        type: "errorbar",
        name: `${item.areaName}`,
        data: item.healthData.map((point) => [point.year, point.lowerCi, point.upperCi]),
        visible: showConfidenceIntervalsData,
      };

    return [lineSeries, confidenceIntervalSeries];

  });

  if (benchmarkData) {
    const englandSeries = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: 'black',
      marker: {
        symbol: 'circle',
      },
    };
    seriesData.unshift(englandSeries);
  };
  
  return seriesData;
}
