import {
  computeDataPercentages,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import Highcharts, {
  LegendItemClickEventObject,
  Series,
  SeriesOptionsType,
} from 'highcharts';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { generatePopPyramidTooltipForPoint } from '.';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { FormatValueAsWholeNumberAbsolute } from '@/lib/chartHelpers/labelFormatters';

const toggleClickSeries = (self: Series): boolean => {
  self.chart.series.forEach((series) => {
    if (series.name === self.name) {
      series.setVisible(!series.visible);
    }
  });
  return false;
};

const createPopPyramidSeriesOptions = (
  xAxisTitle: string,
  yAxisTitle: string,
  dataForArea: PopulationDataForArea,
  accessibilityLabel: string
): Highcharts.Options => {
  const femaleSeries = computeDataPercentages(
    dataForArea.femaleSeries,
    dataForArea.total
  );
  const maleSeries = computeDataPercentages(
    dataForArea.maleSeries,
    dataForArea.total
  );
  const maxTick = Math.abs(Math.max(...femaleSeries, ...maleSeries));
  return {
    chart: {
      type: 'bar',
      height: 800,
      animation: false,
      events: {
        load: function () {
          const items = this.legend.allItems;

          items.forEach((item) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - we know this item will be a legendItem and dynamic property 'group' will be created
            if (!item || !item.legendItem || !item.legendItem.group) return;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - we know this item will be a legendItem and dynamic property 'group' will be created
            item.legendItem.group.on('mouseover', () => {
              this.series.forEach((series) => {
                if (item.name === series.name) {
                  series.setState('hover');
                  series.setState('inactive');
                }
              });
            });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - we know this item will be a legendItem and dynamic property 'group' will be created
            item.legendItem.group.on('mouseout', () => {
              this.series.forEach((series) => {
                if (item.name === series.name) {
                  series.setState('normal');
                }
              });
            });
          });
        },
      },
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        crisp: false,
        animation: false,
      },
    },
    credits: { enabled: false },
    title: { style: { display: 'none' } },
    legend: {
      verticalAlign: 'top',
      layout: 'horizontal',
      alignColumns: true,
      reversed: true,
      itemStyle: {
        fontSize: '16px',
      },
      events: {
        itemClick: function (event: LegendItemClickEventObject) {
          return toggleClickSeries(event.legendItem as Series);
        },
      },
    },
    xAxis: [
      {
        categories: dataForArea.ageCategories,
        title: {
          text: xAxisTitle,
          align: 'high',
          offset: 2,
          rotation: 0,
          style: {
            fontSize: '19px',
          },
        },
        lineColor: GovukColours.DarkSlateGray,
        tickWidth: 1,
        tickLength: 10,
        tickmarkPlacement: 'on',
        tickColor: GovukColours.DarkSlateGray,
        labels: {
          style: {
            fontSize: '16px',
          },
        },
      },
      {
        opposite: true,
        reversed: false,
        categories: dataForArea.ageCategories,
        linkedTo: 0,
        title: {
          text: xAxisTitle,
          align: 'high',
          offset: 4,
          rotation: 0,
          style: {
            fontSize: '19px',
          },
        },
        lineColor: GovukColours.DarkSlateGray,
        tickWidth: 1,
        tickLength: 10,
        tickmarkPlacement: 'on',
        tickColor: GovukColours.DarkSlateGray,
        accessibility: {
          description: '{xAxisTitle} degrees {series.name}',
        },
        labels: {
          style: {
            fontSize: '16px',
          },
        },
      },
    ],
    yAxis: {
      title: {
        text: yAxisTitle,
        style: {
          fontSize: '19px',
        },
      },
      min: -maxTick,
      max: maxTick,
      lineWidth: 1,
      lineColor: GovukColours.DarkSlateGray,
      tickWidth: 1,
      tickLength: 5,
      tickColor: GovukColours.DarkSlateGray,
      gridLineWidth: 0,
      labels: {
        formatter: FormatValueAsWholeNumberAbsolute,
        align: 'center',
        style: {
          fontSize: '16px',
        },
      },
      accessibility: {
        enabled: false,
        description: accessibilityLabel,
      },
      tickInterval: 1,
    },
    tooltip: {
      padding: 10,
      headerFormat: `<div style="margin:0px; padding:0px;">
            <span style="font-weight: bold; display: block;">
            ${dataForArea.areaName}
            </span>
        <span>Age {key}</span><div>`,
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(this, generatePopPyramidTooltipForPoint);
      },
      useHTML: true,
    },
    series: [
      {
        name: 'Female',
        type: 'bar',
        data: femaleSeries,
        xAxis: 0,
        color: GovukColours.Female,
        pointWidth: 17,
        dataLabels: {
          enabled: false,
          inside: false,
          format: '{(abs point.y):.1f}%',
          color: GovukColours.Black,
          style: {
            fontWeight: 'light',
            fontSize: '16px',
          },
        },
      },
      {
        name: 'Male',
        type: 'bar',
        data: maleSeries.map((datapoint) => -datapoint),
        xAxis: 1,
        color: GovukColours.Male,
        pointWidth: 17,
        dataLabels: {
          enabled: false,
          inside: false,
          format: '{(abs point.y):.1f}%',
          color: GovukColours.Black,
          style: {
            fontWeight: 'light',
            fontSize: '16px',
          },
        },
      },
    ],
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };
};

const createAdditionalChartSeries = (
  dataForBenchmark: PopulationDataForArea | undefined,
  dataForGroup: PopulationDataForArea | undefined
): Array<SeriesOptionsType> => {
  const series: Array<SeriesOptionsType> = [];

  if (dataForGroup) {
    const femaleGroupSeries = computeDataPercentages(
      dataForGroup.femaleSeries,
      dataForGroup.total
    );
    const maleGroupSeries = computeDataPercentages(
      dataForGroup.maleSeries,
      dataForGroup.total
    );

    series.push(
      {
        name: `Group: ${dataForGroup.areaName}`,
        type: 'line',
        data: femaleGroupSeries,
        stack: 2,
        color: GovukColours.Turquoise,
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
      },
      {
        name: `Group: ${dataForGroup.areaName}`,
        type: 'line',
        stack: 4,
        data: maleGroupSeries.map((datapoint) => -datapoint),
        color: GovukColours.Turquoise,
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
        showInLegend: false,
      }
    );
  }

  if (dataForBenchmark) {
    const femaleBenchmarkSeries = computeDataPercentages(
      dataForBenchmark.femaleSeries,
      dataForBenchmark.total
    );
    const maleBenchmarkSeries = computeDataPercentages(
      dataForBenchmark.maleSeries,
      dataForBenchmark.total
    );
    series.push(
      {
        name: `Benchmark: ${dataForBenchmark.areaName}`,
        data: femaleBenchmarkSeries,
        type: 'line',
        stack: 1,
        color: GovukColours.CharcoalGray,
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
      },
      {
        name: `Benchmark: ${dataForBenchmark.areaName}`,
        data: maleBenchmarkSeries.map((datapoint) => -datapoint),
        type: 'line',
        stack: 3,
        color: GovukColours.CharcoalGray,
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
        showInLegend: false,
      }
    );
  }
  return series;
};

export const createChartPyramidOptions = (
  xAxisTitle: string,
  yAxisTitle: string,
  accessibilityLabel: string,
  dataForSelectedArea: PopulationDataForArea,
  dataForBenchmark?: PopulationDataForArea,
  dataForSelectedGroup?: PopulationDataForArea
): Highcharts.Options => {
  const populationPyramidOptions: Highcharts.Options =
    createPopPyramidSeriesOptions(
      xAxisTitle,
      yAxisTitle,
      dataForSelectedArea,
      accessibilityLabel
    );
  if (!populationPyramidOptions.series) {
    return populationPyramidOptions;
  }
  if (populationPyramidOptions.series.length > 0) {
    const seriesOptions = createAdditionalChartSeries(
      dataForBenchmark,
      dataForSelectedGroup
    );
    if (seriesOptions)
      seriesOptions.forEach((series) => {
        populationPyramidOptions.series?.push(series);
      });
  }
  return populationPyramidOptions;
};
