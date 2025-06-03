import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { generateChartOptions } from './SpineChartOptions';

export interface SpineChartProps {
  name: string;
  units: string;
  period: number;
  benchmarkName: string;
  benchmarkValue: number;
  quartileData: QuartileData;
  areaOneValue?: number;
  areaOneOutcome?: BenchmarkOutcome;
  areaTwoValue?: number;
  areaTwoOutcome?: BenchmarkOutcome;
  areaNames: string[];
  benchmarkMethod?: BenchmarkComparisonMethod;
  alternativeBenchmarkValue?: number;
  alternativeBenchmarkName: string;
  alternativeBenchmarkOutcome?: BenchmarkOutcome;
  benchmarkToUse: string;
}

export function SpineChart(props: Readonly<SpineChartProps>) {
  const spineChartsOptions = generateChartOptions(props);
  if (!spineChartsOptions)
    return (
      <div style={{ textAlign: 'center' }}>Insufficient data available</div>
    );

  const { benchmarkValue } = props;

  return (
    <div data-testid={`spineChart-component`}>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-spineChart',
        }}
        highcharts={Highcharts}
        options={spineChartsOptions}
        callback={(chart: Highcharts.Chart) => {
          if (!chart) return;
          if (!benchmarkValue) return;
          if (!chart.series.length) return;

          const benchmarkPoint =
            chart.series[chart.series.length - 1].points[0];

          const pos = benchmarkPoint.pos(true, benchmarkPoint.plotY);

          if (!pos) return;

          const [x, y] = pos;
          chart.renderer
            .rect(x - 1, y - 20, 2, 40)
            .attr({ fill: '#000', zIndex: 5 })
            .add();
        }}
      />
    </div>
  );
}
