import { WeatherForecast } from '@/generated-sources/api-client';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface PyramidChartProps {
  data: WeatherForecast[];
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  Highcharts.Templating.helpers.initial = (label) => label.charAt(0);

  // temperature categories:
  const dateCategories = data.map(
    (datapoint) => datapoint.date?.toLocaleDateString('en-GB') ?? ''
  );

  // temp data
  const tempC = data.map((datapoint) => datapoint.temperatureC ?? null);
  const tempF = data.map((datapoint) => datapoint.temperatureF ?? null);

  const populationPyramidOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: { text: title },
    // TODO: DW understand what this does
    // accessibility: {
    //   point: {
    //     valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.',
    //   },
    // },
    xAxis: [
      {
        categories: dateCategories,
        title: { text: xAxisTitle },
        reversed: false,
        labels: {
          step: 50,
        },
        // accessibility: {
        //   description: 'Age (male)',
        // },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: dateCategories,
        title: { text: xAxisTitle },
        linkedTo: 0,
        labels: {
          step: 1,
        },
        // accessibility: {
        //   description: 'Age (female)',
        // },
      },
    ],
    yAxis: {
      title: {
        text: yAxisTitle,
      },
      labels: {
        format: '{value}',
      },
      accessibility: {
        enabled: false,
        description: accessibilityLabel,
      },
    },

    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },

    tooltip: {
      format:
        '<b>{point.category}</b><br/>' +
        'Temperature: {(point.y)}°{initial series.name}',
    },

    series: [
      {
        name: 'Celcius',
        type: 'bar',
        data: tempC,
      },
      {
        name: 'Fahrenheit',
        type: 'bar',
        data: tempF,
      },
    ],
  };

  return (
    <div data-testid="populationPyramid-component">
      <HighchartsReact
        highcharts={Highcharts}
        options={populationPyramidOptions}
      />
    </div>
  );
}
