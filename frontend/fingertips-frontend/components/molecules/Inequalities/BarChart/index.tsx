'use client';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import {
  getDynamicKeys,
  Inequalities,
  InequalitiesBarChartData,
  YearlyHealthDataGroupedByInequalities,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';

interface InequalitiesBarChartProps {
  barChartData: InequalitiesBarChartData;
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities;
  type?: Inequalities;
}

const mapToYAxisTitle: Record<Inequalities, string> = {
  [Inequalities.Sex]: 'Sex',
  [Inequalities.Deprivation]: 'Deprivation deciles',
};

// This needs to be done more elegantly
const getKeysForSexInequality = (keys: string[], type: Inequalities) =>
  type === Inequalities.Sex ? keys.filter((key) => key !== 'Persons') : keys;

export function InequalitiesBarChart({
  barChartData,
  yearlyHealthDataGroupedByInequalities,
  type = Inequalities.Sex,
}: Readonly<InequalitiesBarChartProps>) {
  const yAxisTitlePrefix = 'Inequality type:';

  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    type
  );
  const barChartFields = getKeysForSexInequality(dynamicKeys, type);

  const seriesData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      data: barChartFields.map((field) => ({
        name: field,
        y: barChartData.data.inequalities[field]?.value,
      })),
    },
  ];

  const barChartOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    title: {
      style: { display: 'none' },
    },
    chart: { type: 'bar', height: '50%', spacingTop: 20, spacingBottom: 50 },
    xAxis: {
      title: {
        text: `${yAxisTitlePrefix} ${mapToYAxisTitle[type]}`,
        margin: 20,
      },
      categories: barChartFields,
      lineWidth: 0,
    },
    yAxis: {
      title: { text: 'Value', margin: 20 },
    },
    accessibility: { enabled: false },
    legend: { enabled: false },
    series: seriesData,
    plotOptions: {
      bar: {
        pointPadding: 0.3,
      },
    },
  };

  return (
    <div data-testid="inequalitiesBarChart-component">
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}
