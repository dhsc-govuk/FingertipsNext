import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

export interface SpineChartProps {
  best: number;
  bestQuartile: number;
  worstQuartile: number;
  worst: number;
}

const categories = [
  'Important stat'
];

const spineChartsOptions = {
  chart: {
      type: 'bar'
  },
  legend: {
      enabled: false
  },
  title: {
      text: ''
  },
  accessibility: {
      point: {
          valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
      }
  },
  xAxis: [{
      categories: categories,
      reversed: false,
      labels: {
          enabled: false,
          step: 1
      },
      accessibility: {
          description: 'Age (male)'
      }
  }, { // mirror axis on right side
      opposite: true,
      reversed: false,
      categories: categories,
      linkedTo: 0,
      labels: {
          enabled: false,
          step: 1
      },
      accessibility: {
          description: 'Age (female)'
      }
  }],
  yAxis: {
      title: {
          text: null
      },
      labels: {
          enabled: false,
      },
      accessibility: {
          description: 'Percentage population',
          rangeDescription: 'Range: 0 to 5%'
      }
  },

  plotOptions: {
      series: {
          stacking: 'normal',
      }
  },

  tooltip: {
      format: '<b>{series.name}, age {point.category}</b><br/>' +
          'Population: {(abs point.y):.2f}%'
  },

  series: [{
      name: 'Worst',
      color: 'rgba(160,160,160,1)',
      data: [
          -1.38
      ]
  }, {
      name: 'Best',
      color: 'rgba(160,160,160,1)',
      data: [
          1.35
      ]
  },{
      name: '25th percentile',
      color: 'rgba(80,80,80,1)',
      data: [
          -0.78
      ]
  }, {
      name: '75th percentile',
      color: 'rgba(80,80,80,1)',
      data: [
          0.55
      ]
  }]
}

export function SpineChart({
  best,
  bestQuartile,
  worstQuartile,
  worst,
}: Readonly<SpineChartProps>) {
  return (
    <div data-testid="spineChart-component">
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-spineChart',
        }}
        highcharts={Highcharts}
        options={spineChartsOptions}
      />
    </div>
  );
}