import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { lineChartDefaultOptions } from '@/components/organisms/LineChart/lineChartHelpers';
import {
  generateInequalitiesLineChartSeriesData,
  getDynamicKeys,
  Inequalities,
  InequalitiesChartData,
  YearlyHealthDataGroupedByInequalities,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';

interface InequalitiesLineChartProps {
  lineChartData: InequalitiesChartData;
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities;
  areasSelected: string[];
  type?: Inequalities;
  yAxisTitleText?: string;
}

const generateInequalitiesLineChartTooltipStringList = (
  point: Highcharts.Point,
  symbol?: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
  <span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.series.name}</br>Value: ${point.y}</span></div></div>`,
];

export function InequalitiesLineChart({
  lineChartData,
  yearlyHealthDataGroupedByInequalities,
  areasSelected,
  type = Inequalities.Sex,
  yAxisTitleText = 'Value',
}: Readonly<InequalitiesLineChartProps>) {
  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    type
  );

  const seriesData = generateInequalitiesLineChartSeriesData(
    dynamicKeys,
    type,
    lineChartData.rowData,
    areasSelected
  );

  const lineChartOptions: Highcharts.Options = {
    ...lineChartDefaultOptions,
    yAxis: {
      title: { text: yAxisTitleText, margin: 20 },
      minorTickInterval: 'auto',
      minorTicksPerMajor: 2,
    },
    xAxis: {
      title: { text: 'Year', margin: 20 },
      tickLength: 0,
      allowDecimals: false,
    },
    accessibility: {
      enabled: false,
    },
    legend: {
      verticalAlign: 'top',
      align: 'left',
    },
    series: seriesData,
    tooltip: {
      headerFormat:
        `<span style="font-weight: bold">${lineChartData.areaName}</span><br/>` +
        '<span>Year {point.x}</span><br/>',
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(
          this,
          generateInequalitiesLineChartTooltipStringList
        );
      },
      useHTML: true,
    },
  };
  return (
    <div data-testid="inequalitiesLineChart-component">
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-inequalitiesLineChart',
        }}
        highcharts={Highcharts}
        options={lineChartOptions}
      />
    </div>
  );
}
