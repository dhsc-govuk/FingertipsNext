import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';
import { showConfidenceIntervals } from '@/lib/chartHelpers/chartHelpers';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  benchmarkData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean
): Highcharts.SeriesOptionsType[] {
  const seriesData = data.map<Highcharts.SeriesOptionsType>((item, index) => ({
    type: 'line',
    name: `${item.areaName}`,
    data: item.healthData.map((point) => [point.year, point.value]),
    marker: {
      symbol: symbols[index % symbols.length],
    },
  }));
  

//   const seriesData = data.flatMap<Highcharts.SeriesOptionsType>((item, index) => {
//
//     return [
//       {
//         type: 'line',
//         name: `${item.areaName}`,
//         data: item.healthData.map((point) => [point.year, point.value]),
//         marker: {
//           symbol: symbols[index % symbols.length],
//         },
//       },
//       {
//         type: "errorbar",
//         name: `${item.areaName}`,
//         data: item.healthData.map((point) => [point.year, point.lowerCi, point.upperCi]),
//       },
// ]
//   });



  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesLineOptions = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: 'black',
      marker: {
        symbol: 'circle',
      },
    };
    seriesData.unshift(englandSeries);
  }
  
  if(showConfidenceIntervalsData) {
    const ci = showConfidenceIntervals(data)
    seriesData.push(...ci)
  }
  
// const ci = showConfidenceIntervals(data)
// 
// seriesData.push(...ci)
  console.log('series data ==== ',seriesData)

  return seriesData;
}
